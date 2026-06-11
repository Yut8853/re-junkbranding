import { clamp01 } from './utils/math';
import type { NightSeaEvent, NightSeaTimeline } from './types';

/**
 * 「夜光虫の海」イベントタイムラインの再生クラス。
 *
 * /public の JSON に書かれたイベント列（sparkle = 粒子のきらめき、
 * wavePulse = 波のうねり強調）をループ再生し、
 * sparklePulse / wavePulse の 2 つのパルス値として公開する。
 * パルスは毎フレーム減衰し、ループがイベント時刻をまたぐたびに跳ね上がる。
 * Showroom の frame() がこの値を粒子と海のユニフォームへ反映する。
 */
export class NightSea {
  /** 時刻順にソート済みのイベント列。 */
  private events: NightSeaEvent[] = [];
  /** ループ全体の長さ（秒）。JSON 読み込み失敗時のフォールバックは 24 秒。 */
  private duration = 24;
  /** 前フレームのループ内時刻。イベント跨ぎ判定に使う。 */
  private lastTime: number | null = null;

  /** 粒子のきらめき強度（毎フレーム ×0.9 で減衰）。 */
  sparklePulse = 0;
  /** 波のうねり強度（毎フレーム ×0.94 で減衰）。 */
  wavePulse = 0;

  /** タイムライン JSON を読み込む。失敗してもエフェクトなしで静かに続行する。 */
  async load(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) return;
      const timeline = (await response.json()) as NightSeaTimeline;
      this.duration = Math.max(1, timeline.durationSeconds || 24);
      this.events = [...(timeline.events ?? [])]
        .filter((event) => event.type === 'sparkle' || event.type === 'wavePulse')
        .sort((a, b) => a.time - b.time);
      this.lastTime = null;
    } catch {
      this.events = [];
    }
  }

  /** 経過時間 t までループを進め、イベント発火とパルス減衰を行う。 */
  update(t: number): void {
    this.crossEvents(t);
    this.sparklePulse *= 0.9;
    this.wavePulse *= 0.94;
  }

  /** 前フレームから今フレームの間に跨いだイベントをすべて発火する。 */
  private crossEvents(t: number): void {
    if (!this.events.length) return;

    const loopTime = t % this.duration;
    if (this.lastTime === null) {
      this.lastTime = loopTime;
      return;
    }

    for (const event of this.events) {
      // ループ末尾から先頭へ巻き戻った場合も正しく跨ぎを検知する。
      const crossed = loopTime >= this.lastTime
        ? event.time > this.lastTime && event.time <= loopTime
        : event.time > this.lastTime || event.time <= loopTime;

      if (crossed) this.trigger(event);
    }

    this.lastTime = loopTime;
  }

  /** イベント 1 件をパルスへ加算する（上限つき）。 */
  private trigger(event: NightSeaEvent): void {
    const amount = clamp01(event.intensity);
    if (event.type === 'sparkle') {
      this.sparklePulse = Math.min(1.35, this.sparklePulse + amount * 0.82);
      return;
    }

    this.wavePulse = Math.min(1.15, this.wavePulse + amount * 0.74);
  }
}
