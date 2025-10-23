import ReactECharts from 'echarts-for-react';
import { useMemo, useCallback } from 'react';
import type { TooltipComponentFormatterCallbackParams } from 'echarts';
import { ELEMENTS } from '../data/elements';
import { useActiveElement } from '../lib/ActiveElementContext';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const accentColor = '#C2A050';
const spokeColor = 'rgba(158, 123, 45, 0.45)';
const gridColor = 'rgba(109, 87, 54, 0.35)';

const getLevelState = (level: number) => {
  if (level >= 8) return 'High';
  if (level >= 4) return 'Normal';
  return 'Low';
};

export const RadarPanel = () => {
  const { activeSymbol, setActiveSymbol, pinSymbol } = useActiveElement();
  const prefersReducedMotion = usePrefersReducedMotion();

  const option = useMemo(() => {
    const indicator = ELEMENTS.map((element) => ({
      name: element.symbol,
      max: 10,
    }));

    const levels = ELEMENTS.map((element) => element.level);
    const reference = ELEMENTS.map(() => 6.5);

    return {
      backgroundColor: 'transparent',
      radar: {
        indicator,
        radius: '72%',
        center: ['50%', '50%'],
        startAngle: 90,
        splitNumber: 5,
        nameGap: 18,
        name: {
          formatter: (value: string) =>
            `{${value === activeSymbol ? 'active' : 'default'}|${value}}`,
          rich: {
            default: {
              color: 'rgba(59,45,31,0.58)',
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: 1.4,
              fontFamily: 'DM Sans, system-ui, sans-serif',
            },
            active: {
              color: accentColor,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: 1.6,
              fontFamily: 'DM Sans, system-ui, sans-serif',
            },
          },
        },
        splitArea: {
          areaStyle: {
            color: [
              'rgba(249,242,228,0.72)',
              'rgba(249,242,228,0.45)',
              'rgba(249,242,228,0.3)',
              'rgba(249,242,228,0.2)',
              'rgba(249,242,228,0.12)',
            ],
          },
        },
        splitLine: {
          lineStyle: {
            color: gridColor,
            width: 1,
          },
        },
        axisLine: {
          lineStyle: {
            color: spokeColor,
            width: 1,
          },
        },
        axisName: {
          color: 'rgba(59,45,31,0.6)',
          fontFamily: 'DM Sans, system-ui, sans-serif',
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          color: 'rgba(126,106,76,0.78)',
          fontSize: 10,
          margin: 6,
          fontFamily: 'DM Sans, system-ui, sans-serif',
        },
        axisPointer: {
          show: true,
          lineStyle: {
            color: accentColor,
            width: 2,
          },
        },
      },
      tooltip: {
        trigger: 'axis',
        confine: true,
        backgroundColor: 'rgba(59,45,31,0.92)',
        borderWidth: 0,
        padding: [10, 14],
        textStyle: {
          fontFamily: 'DM Sans, system-ui, sans-serif',
          fontSize: 12,
          fontWeight: 500,
        },
        formatter: (
          params:
            | TooltipComponentFormatterCallbackParams
            | TooltipComponentFormatterCallbackParams[],
        ) => {
          const primary = Array.isArray(params) ? params[0] : params;
          const source = primary as TooltipComponentFormatterCallbackParams;
          const candidate = source as unknown as Record<string, unknown>;
          const dimensionIndex =
            typeof candidate.dimensionIndex === 'number'
              ? (candidate.dimensionIndex as number)
              : typeof candidate.dataIndex === 'number'
                ? (candidate.dataIndex as number)
                : undefined;
          if (typeof dimensionIndex !== 'number') {
            return '';
          }
          const element = ELEMENTS[dimensionIndex];
          if (!element) {
            return '';
          }
          const level = element.level;
          const levelState = getLevelState(level);
          const valueText =
            element.value !== undefined ? `${element.value} ${element.unit}` : `${level} / 10`;
          return `${element.symbol} — ${valueText} — Niveau ${level}/10 (${levelState})`;
        },
      },
      series: [
        {
          name: 'Intervalle',
          type: 'radar',
          data: [
            {
              value: reference,
            },
          ],
          silent: true,
          lineStyle: {
            width: 0,
          },
          areaStyle: {
            color: 'rgba(194,160,80,0.12)',
          },
          animation: false,
          z: 1,
        },
        {
          name: 'Échantillon',
          type: 'radar',
          data: [
            {
              value: levels,
            },
          ],
          smooth: true,
          symbol: 'circle',
          symbolSize: (value: number, params: { dimensionIndex?: number }) => {
            const element =
              typeof params.dimensionIndex === 'number'
                ? ELEMENTS[params.dimensionIndex]
                : undefined;
            return element && element.symbol === activeSymbol ? 9 : 6;
          },
          itemStyle: {
            color: (params: { dimensionIndex?: number }) => {
              const element =
                typeof params.dimensionIndex === 'number'
                  ? ELEMENTS[params.dimensionIndex]
                  : undefined;
              return element && element.symbol === activeSymbol
                ? accentColor
                : 'rgba(59,45,31,0.82)';
            },
          },
          lineStyle: {
            color: 'rgba(59,45,31,0.6)',
            width: 2,
            join: 'round',
          },
          areaStyle: {
            color: 'rgba(59,45,31,0.18)',
          },
          emphasis: {
            lineStyle: {
              width: 3,
            },
          },
          animationDuration: prefersReducedMotion ? 0 : 280,
          animationEasing: 'cubicOut',
          animationDelay: prefersReducedMotion ? 0 : 120,
          z: 5,
        },
      ],
    };
  }, [activeSymbol, prefersReducedMotion]);

  type AxisPointerEvent = {
    axesInfo?: Array<{
      seriesDataIndices?: Array<{
        dimensionIndex?: number;
      }>;
    }>;
  };

  const handleUpdateAxisPointer = useCallback(
    (event: AxisPointerEvent) => {
      const dimensionIndex = event.axesInfo?.[0]?.seriesDataIndices?.[0]?.dimensionIndex;
      if (typeof dimensionIndex !== 'number') {
        return;
      }
      const element = ELEMENTS[dimensionIndex];
      if (element && element.symbol !== activeSymbol) {
        setActiveSymbol(element.symbol);
      }
    },
    [activeSymbol, setActiveSymbol],
  );

  type RadarClickEvent = {
    dimensionIndex?: number;
  };

  const handleClick = useCallback(
    (params: RadarClickEvent) => {
      if (typeof params.dimensionIndex !== 'number') {
        return;
      }
      const element = ELEMENTS[params.dimensionIndex];
      if (!element) {
        return;
      }
      pinSymbol(activeSymbol === element.symbol ? null : element.symbol);
    },
    [activeSymbol, pinSymbol],
  );

  const handleMouseOut = useCallback(() => {
    setActiveSymbol(null);
  }, [setActiveSymbol]);

  return (
    <article className="flex h-full flex-col rounded-card border border-divider/40 bg-surface px-7 py-8 shadow-panel">
      <header className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-[28px] leading-[1.15] text-text">
            Empreinte minérale
          </h3>
          <span className="text-xs uppercase tracking-[0.28em] text-muted/70">Échelle 1 – 10</span>
        </div>
        <p className="text-sm leading-relaxed text-muted">
          Les cercles correspondent aux paliers 2, 4, 6, 8 et 10. Les pointes dorées indiquent les
          éléments dépassant le profil type du millésime.
        </p>
      </header>
      <div className="relative mt-6 flex-1">
        <ReactECharts
          style={{ height: '100%', minHeight: 360 }}
          option={option}
          notMerge
          lazyUpdate
          onEvents={{
            updateAxisPointer: handleUpdateAxisPointer,
            click: handleClick,
            globalout: handleMouseOut,
          }}
        />
      </div>
      <div className="mt-6 rounded-[18px] border border-divider/30 bg-surfaceMuted/50 px-5 py-4 text-sm leading-relaxed text-muted">
        {activeSymbol ? (
          <p>
            <strong className="text-text">{activeSymbol}</strong> — repéré sur l&rsquo;ensemble des panneaux pour une analyse
            croisée immédiate.
          </p>
        ) : (
          <p>
            Survolez le radar pour révéler les corrélations ou sélectionnez une case du tableau pour verrouiller un élément.
          </p>
        )}
      </div>
    </article>
  );
};
