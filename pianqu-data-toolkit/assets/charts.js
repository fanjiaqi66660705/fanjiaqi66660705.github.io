// 片区化乡村振兴 · 数据投名状 —— 图表脚本
// 说明：以下全部为「示意数据」，用于演示呈现方式，不代表任何真实片区统计值。

(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var t2 = style.getPropertyValue('--t2').trim();
  var t3 = style.getPropertyValue('--t3').trim();

  var CJK = 'Work Sans, PingFang SC, Microsoft YaHei, sans-serif';

  // 三档着色：得分 >=85 / 75-85 / <75
  function tierColor(v) {
    if (v >= 85) return accent;
    if (v >= 75) return t2;
    return t3;
  }

  /* ============ 图 1　片区振兴指数空间分布示意 ============ */
  var villages = [
    { name: '甲村', x: 0, y: 0, score: 88, pop: 3200, size: 38, pos: 'bottom' },
    { name: '乙村', x: -0.92, y: 1.02, score: 82, pop: 2400, size: 30, pos: 'top' },
    { name: '丙村', x: 0.95, y: 0.92, score: 86, pop: 1900, size: 26, pos: 'top' },
    { name: '丁村', x: -1.02, y: -0.9, score: 71, pop: 1500, size: 20, pos: 'bottom' },
    { name: '戊村', x: 1.0, y: -1.0, score: 78, pop: 2100, size: 28, pos: 'bottom' }
  ];

  var edges = [
    { source: '甲村', target: '乙村', w: 8 },
    { source: '甲村', target: '丙村', w: 9 },
    { source: '甲村', target: '戊村', w: 5 },
    { source: '乙村', target: '丙村', w: 3 },
    { source: '甲村', target: '丁村', w: 2 },
    { source: '丁村', target: '戊村', w: 1 }
  ];

  var chartMap = echarts.init(document.getElementById('chart-map'), null, { renderer: 'svg' });
  chartMap.setOption({
    animation: false,
    textStyle: { fontFamily: CJK },
    tooltip: {
      appendToBody: true,
      backgroundColor: '#fff',
      borderColor: rule,
      textStyle: { color: ink, fontFamily: CJK, fontSize: 12 },
      formatter: function (p) {
        if (p.dataType === 'edge') {
          return p.data.source + ' ↔ ' + p.data.target + '<br/>跨村协作强度：<b>' + p.data.w + '</b> / 10';
        }
        var v = p.data;
        return '<b>' + v.name + '</b><br/>综合得分：<b>' + v.score + '</b>' +
               '<br/>常住人口：' + v.pop + ' 人' +
               '<br/>梯队：' + (v.score >= 85 ? '第一梯队' : v.score >= 75 ? '第二梯队' : '第三梯队');
      }
    },
    series: [{
      type: 'graph',
      layout: 'none',
      roam: false,
      symbol: 'circle',
      edgeSymbol: ['none', 'none'],
      label: {
        show: true,
        color: ink,
        fontSize: 12,
        fontWeight: 'bold',
        lineHeight: 15,
        formatter: function (p) {
          return p.data.name + '\n' + p.data.score;
        }
      },
      lineStyle: { color: accent2, opacity: 0.5, curveness: 0.08 },
      emphasis: { focus: 'adjacency', lineStyle: { opacity: 0.9 } },
      data: villages.map(function (v) {
        return {
          name: v.name, x: v.x, y: v.y, value: v.score, score: v.score, pop: v.pop,
          symbolSize: v.size,
          label: { position: v.pos },
          itemStyle: { color: tierColor(v.score), borderColor: '#fff', borderWidth: 2 }
        };
      }),
      links: edges.map(function (e) {
        return {
          source: e.source, target: e.target, w: e.w,
          lineStyle: { width: 1 + e.w * 0.45, opacity: 0.35 + e.w * 0.045 }
        };
      })
    }]
  });
  window.addEventListener('resize', function () { chartMap.resize(); });

  /* ============ 图 2　多片区六维能力雷达对比 ============ */
  var chartRadar = echarts.init(document.getElementById('chart-radar'), null, { renderer: 'svg' });
  chartRadar.setOption({
    animation: false,
    textStyle: { fontFamily: CJK },
    tooltip: { appendToBody: true, backgroundColor: '#fff', borderColor: rule,
      textStyle: { color: ink, fontFamily: CJK, fontSize: 12 } },
    legend: {
      bottom: 0, itemWidth: 14, itemHeight: 8, itemGap: 14,
      textStyle: { color: muted, fontFamily: CJK, fontSize: 12 }
    },
    radar: {
      center: ['50%', '50%'],
      radius: '60%',
      splitNumber: 4,
      axisName: { color: ink, fontFamily: CJK, fontSize: 12, fontWeight: 'bold' },
      axisLine: { lineStyle: { color: rule } },
      splitLine: { lineStyle: { color: rule } },
      splitArea: { areaStyle: { color: ['#FFFFFF', bg2] } },
      indicator: [
        { name: '产业兴旺', max: 100 },
        { name: '生态宜居', max: 100 },
        { name: '乡风文明', max: 100 },
        { name: '治理有效', max: 100 },
        { name: '生活富裕', max: 100 },
        { name: '片区统筹', max: 100 }
      ]
    },
    series: [{
      type: 'radar',
      symbolSize: 5,
      data: [
        { name: '东部片区', value: [86, 81, 78, 74, 83, 58],
          lineStyle: { width: 2.2, color: accent }, itemStyle: { color: accent },
          areaStyle: { color: accent + '26' } },
        { name: '中部片区', value: [72, 85, 82, 79, 76, 70],
          lineStyle: { width: 2.2, color: accent2 }, itemStyle: { color: accent2 },
          areaStyle: { color: accent2 + '1f' } },
        { name: '西部片区', value: [64, 70, 66, 62, 61, 75],
          lineStyle: { width: 2, color: muted, type: 'dashed' }, itemStyle: { color: muted },
          areaStyle: { color: muted + '14' } }
      ]
    }]
  });
  window.addEventListener('resize', function () { chartRadar.resize(); });

  /* ============ 图 3　维度权重（熵值法） ============ */
  var dims = [
    { name: '产业兴旺', w: 0.212 },
    { name: '片区统筹', w: 0.191 },
    { name: '生活富裕', w: 0.170 },
    { name: '治理有效', w: 0.149 },
    { name: '生态宜居', w: 0.147 },
    { name: '乡风文明', w: 0.131 }
  ];

  var chartWeight = echarts.init(document.getElementById('chart-weight'), null, { renderer: 'svg' });
  chartWeight.setOption({
    animation: false,
    textStyle: { fontFamily: CJK },
    grid: { left: 76, right: 62, top: 16, bottom: 34 },
    tooltip: { appendToBody: true, backgroundColor: '#fff', borderColor: rule,
      textStyle: { color: ink, fontFamily: CJK, fontSize: 12 },
      formatter: function (p) {
        return p.name + '<br/>权重：<b>' + (p.value * 100).toFixed(1) + '%</b>';
      } },
    xAxis: {
      type: 'value', max: 0.25, min: 0,
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: muted, fontFamily: CJK, fontSize: 11,
        formatter: function (v) { return (v * 100).toFixed(0) + '%'; } },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    },
    yAxis: {
      type: 'category', inverse: true,
      data: dims.map(function (d) { return d.name; }),
      axisLine: { lineStyle: { color: rule } }, axisTick: { show: false },
      axisLabel: { color: ink, fontFamily: CJK, fontSize: 12 }
    },
    series: [{
      type: 'bar',
      barWidth: 20,
      data: dims.map(function (d) {
        return {
          name: d.name, value: d.w,
          itemStyle: { color: d.name === '片区统筹' ? accent2 : accent, borderRadius: [0, 3, 3, 0] }
        };
      }),
      label: {
        show: true, position: 'right', color: ink, fontFamily: CJK,
        fontSize: 12, fontWeight: 'bold',
        formatter: function (p) { return (p.value * 100).toFixed(1) + '%'; }
      }
    }]
  });
  window.addEventListener('resize', function () { chartWeight.resize(); });

  /* ============ 图 4　片区内部村际差异热力图 ============ */
  var heatDims = ['产业兴旺', '生态宜居', '乡风文明', '治理有效', '生活富裕', '片区统筹'];
  var heatVillages = ['甲村', '乙村', '丙村', '丁村', '戊村'];
  var heatRaw = [
    [88, 79, 76, 72, 85, 55],
    [82, 86, 84, 80, 79, 68],
    [85, 76, 74, 70, 82, 62],
    [68, 72, 70, 66, 64, 74],
    [75, 80, 77, 73, 74, 71]
  ];
  var heatData = [];
  for (var yi = 0; yi < heatVillages.length; yi++) {
    for (var xi = 0; xi < heatDims.length; xi++) {
      heatData.push([xi, yi, heatRaw[yi][xi]]);
    }
  }

  var chartHeat = echarts.init(document.getElementById('chart-heat'), null, { renderer: 'svg' });
  chartHeat.setOption({
    animation: false,
    textStyle: { fontFamily: CJK },
    grid: { left: 62, right: 30, top: 34, bottom: 62 },
    tooltip: { appendToBody: true, backgroundColor: '#fff', borderColor: rule,
      textStyle: { color: ink, fontFamily: CJK, fontSize: 12 },
      formatter: function (p) {
        return heatVillages[p.value[1]] + ' · ' + heatDims[p.value[0]] +
               '<br/>得分：<b>' + p.value[2] + '</b>';
      } },
    xAxis: {
      type: 'category', data: heatDims, splitArea: { show: false },
      axisLine: { lineStyle: { color: rule } }, axisTick: { show: false },
      axisLabel: { color: ink, fontFamily: CJK, fontSize: 11.5, interval: 0 }
    },
    yAxis: {
      type: 'category', data: heatVillages, splitArea: { show: false },
      axisLine: { lineStyle: { color: rule } }, axisTick: { show: false },
      axisLabel: { color: ink, fontFamily: CJK, fontSize: 12 }
    },
    visualMap: {
      min: 55, max: 95, calculable: true, orient: 'horizontal',
      left: 'center', bottom: 0, itemWidth: 12, itemHeight: 110,
      textStyle: { color: muted, fontFamily: CJK, fontSize: 11 },
      inRange: { color: [t3, accent] },
      outOfRange: { color: 'transparent' }
    },
    series: [{
      type: 'heatmap',
      data: heatData,
      label: {
        show: true, color: ink, fontFamily: CJK, fontSize: 12, fontWeight: 'bold',
        formatter: function (p) { return p.value[2]; }
      },
      itemStyle: { borderColor: '#fff', borderWidth: 2 },
      emphasis: { itemStyle: { borderColor: accent, borderWidth: 2 } }
    }]
  });
  window.addEventListener('resize', function () { chartHeat.resize(); });
})();
