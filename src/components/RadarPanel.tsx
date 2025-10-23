import ReactECharts from 'echarts-for-react';
import { useMemo, useCallback } from 'react';
import type { TooltipComponentFormatterCallbackParams } from 'echarts';
import { ELEMENTS } from '../data/elements';
import { useActiveElement } from '../lib/ActiveElementContext';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const accentColor = '#C8A96A';

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
        nameGap: 16,
        name: {
          formatter: (value: string) =>
            `{${value === activeSymbol ? 'active' : 'default'}|${value}}`,
          rich: {
            default: {
              color: 'rgba(11,11,12,0.58)',
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: 0.4,
            },
            active: {
              color: accentColor,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 0.6,
            },
          },
        },
        splitArea: {
          areaStyle: {
            color: [
              'rgba(11,11,12,0.02)',
              'rgba(11,11,12,0.04)',
              'rgba(11,11,12,0.06)',
              'rgba(11,11,12,0.08)',
              'rgba(11,11,12,0.1)',
            ],
          },
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(11,11,12,0.12)',
          },
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(11,11,12,0.15)',
            width: 1,
          },
        },
        axisName: {
          color: 'rgba(11,11,12,0.6)',
        },
        axisTick: {
          show: false,
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
        backgroundColor: 'rgba(11,11,12,0.85)',
        borderWidth: 0,
        padding: [8, 12],
        textStyle: {
          fontFamily: 'Inter, system-ui, sans-serif',
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
            color: 'rgba(200,169,106,0.12)',
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
                : 'rgba(11,11,12,0.75)';
            },
          },
          lineStyle: {
            color: 'rgba(11,11,12,0.6)',
            width: 2,
            join: 'round',
          },
          areaStyle: {
            color: 'rgba(11,11,12,0.18)',
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
    <article className="flex h-full flex-col gap-4 rounded-card bg-surface/90 p-6 shadow-panel ring-1 ring-divider/40">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-text">Empreinte minérale — échelle 1–10</h3>
        <p className="text-sm text-subtle">
          Chaque anneau représente deux niveaux. Survolez un rayon pour révéler la concentration.
        </p>
      </div>
      <div className="relative flex-1">
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
      <div className="rounded-xl border border-divider/40 bg-background/70 p-4 text-sm text-subtle">
        {activeSymbol
          ? `Focus sur ${activeSymbol} — suivez son niveau dans la matrice à droite.`
          : 'Survolez un rayon ou sélectionnez un élément pour synchroniser les panneaux.'}
      </div>
    </article>
  );
};
