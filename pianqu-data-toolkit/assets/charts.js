// 绿色农产品可持续发展调研 · 数据投名状 —— 图表脚本
// 说明：以下全部为「示意数据」，用于演示呈现方式，不代表任何真实调研统计值。

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

  // 三档着色：水平指数 >=75 / 60-75 / <60
  function tierColor(v) {
    if (v >= 75) return accent;
    if (v >= 60) return t2;
    return t3;
  }

  /* ============ 图 1　「认知→态度→信任→意愿」传导路径示意 ============ */
  // score 为量表均值折算的百分制水平指数；mean 为 5 级量表原始均值
  var nodes = [
    { name: '绿色认知度', x: -1.0, y: 0.55, score: 68, mean: 3.42, size: 30, pos: 'left' },
    { name: '价格敏感度', x: -1.0, y: -0.55, score: 55, mean: 2.75, size: 26, pos: 'left' },
    { name: '环保态度', x: 0.05, y: 0.78, score: 81, mean: 4.05, size: 34, pos: 'top' },
    { name: '质量信任度', x: 0.05, y: -0.12, score: 64, mean: 3.18, size: 28, pos: 'bottom' },
    { name: '购买意愿', x: 1.0, y: 0.25, score: 73, mean: 3.65, size: 36, pos: 'right' },
    { name: '溢价支付', x: 1.0, y: -0.62, score: 65, mean: 3.24, size: 26, pos: 'right' }
  ];

  var edges = [
    { source: '绿色认知度', target: '环保态度', r: 0.38 },
    { source: '绿色认知度', target: '质量信任度', r: 0.35 },
    { source: '绿色认知度', target: '购买意愿', r: 0.41 },
    { source: '环保态度', target: '购买意愿', r: 0.58 },
    { source: '质量信任度', target: '购买意愿', r: 0.49 },
    { source: '价格敏感度', target: '购买意愿', r: -0.32 },
    { source: '购买意愿', target: '溢价支付', r: 0.45 }
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
          var r = p.data.r;
          return p.data.source + ' → ' + p.data.target +
                 '<br/>相关系数 r = <b>' + r.toFixed(2) + '</b>（p&lt;0.001）' +
                 (r < 0 ? '<br/><span style="color:#A9501F">负向抑制路径</span>' : '');
        }
        var v = p.data;
        return '<b>' + v.name + '</b><br/>量表均值：<b>' + v.mean.toFixed(2) + '</b> / 5' +
               '<br/>水平指数：' + v.score + ' / 100';
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
          return p.data.name + '\n' + p.data.mean.toFixed(2);
        }
      },
      lineStyle: { color: accent, opacity: 0.5, curveness: 0.08 },
      emphasis: { focus: 'adjacency', lineStyle: { opacity: 0.9 } },
      data: nodes.map(function (v) {
        return {
          name: v.name, x: v.x, y: v.y, value: v.score, score: v.score, mean: v.mean,
          symbolSize: v.size,
          label: { position: v.pos },
          itemStyle: { color: tierColor(v.score), borderColor: '#fff', borderWidth: 2 }
        };
      }),
      links: edges.map(function (e) {
        var w = Math.abs(e.r);
        return {
          source: e.source, target: e.target, r: e.r,
          lineStyle: {
            width: 1 + w * 8,
            opacity: 0.3 + w * 0.5,
            color: e.r < 0 ? accent2 : accent,
            type: e.r < 0 ? 'dashed' : 'solid',
            curveness: 0.08
          }
        };
      })
    }]
  });
  window.addEventListener('resize', function () { chartMap.resize(); });

  /* ============ 图 2　三类消费人群六维画像雷达对比 ============ */
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
        { name: '认知', max: 100 },
        { name: '态度', max: 100 },
        { name: '信任', max: 100 },
        { name: '购买意愿', max: 100 },
        { name: '溢价支付', max: 100 },
        { name: '复购行为', max: 100 }
      ]
    },
    series: [{
      type: 'radar',
      symbolSize: 5,
      data: [
        { name: '绿色忠诚型（约25%）', value: [85, 90, 78, 88, 76, 82],
          lineStyle: { width: 2.2, color: accent }, itemStyle: { color: accent },
          areaStyle: { color: accent + '26' } },
        { name: '价格敏感型（约40%）', value: [62, 68, 55, 58, 35, 45],
          lineStyle: { width: 2.2, color: accent2 }, itemStyle: { color: accent2 },
          areaStyle: { color: accent2 + '1f' } },
        { name: '观望型（约35%）', value: [45, 60, 42, 40, 38, 30],
          lineStyle: { width: 2, color: muted, type: 'dashed' }, itemStyle: { color: muted },
          areaStyle: { color: muted + '14' } }
      ]
    }]
  });
  window.addEventListener('resize', function () { chartRadar.resize(); });

  /* ============ 图 3　购买意愿影响因素（标准化回归系数 β） ============ */
  var dims = [
    { name: '环保态度', w: 0.412, sig: '***' },
    { name: '质量信任度', w: 0.223, sig: '***' },
    { name: '价格敏感度', w: -0.187, sig: '***' },
    { name: '绿色认知度', w: 0.158, sig: '***' },
    { name: '收入水平', w: 0.096, sig: '**' },
    { name: '年龄', w: 0.042, sig: 'n.s.' }
  ];

  var chartWeight = echarts.init(document.getElementById('chart-weight'), null, { renderer: 'svg' });
  chartWeight.setOption({
    animation: false,
    textStyle: { fontFamily: CJK },
    grid: { left: 86, right: 62, top: 16, bottom: 34 },
    tooltip: { appendToBody: true, backgroundColor: '#fff', borderColor: rule,
      textStyle: { color: ink, fontFamily: CJK, fontSize: 12 },
      formatter: function (p) {
        var d = dims[p.dataIndex];
        return p.name + '<br/>标准化系数 β = <b>' + d.w.toFixed(3) + '</b>' +
               '<br/>显著性：' + (d.sig === 'n.s.' ? '不显著' : d.sig + '（p' + (d.sig === '**' ? '<0.01' : '<0.001') + '）');
      } },
    xAxis: {
      type: 'value', max: 0.45, min: -0.25,
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: muted, fontFamily: CJK, fontSize: 11 },
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
          itemStyle: {
            color: d.sig === 'n.s.' ? t3 : (d.w < 0 ? accent2 : accent),
            borderRadius: d.w < 0 ? [3, 0, 0, 3] : [0, 3, 3, 0]
          }
        };
      }),
      label: {
        show: true, position: 'right', color: ink, fontFamily: CJK,
        fontSize: 12, fontWeight: 'bold',
        formatter: function (p) {
          var d = dims[p.dataIndex];
          return d.w.toFixed(3) + ' ' + d.sig;
        }
      }
    }]
  });
  window.addEventListener('resize', function () { chartWeight.resize(); });

  /* ============ 图 4　年龄段 × 六维行为得分热力图 ============ */
  var heatDims = ['认知', '态度', '信任', '购买意愿', '溢价支付', '复购行为'];
  var heatGroups = ['18-25岁', '26-35岁', '36-45岁', '46-60岁', '60岁以上'];
  var heatRaw = [
    [72, 82, 60, 70, 62, 55],
    [76, 85, 66, 78, 68, 64],
    [68, 78, 62, 70, 60, 58],
    [58, 72, 58, 60, 52, 48],
    [48, 66, 55, 50, 42, 40]
  ];
  var heatData = [];
  for (var yi = 0; yi < heatGroups.length; yi++) {
    for (var xi = 0; xi < heatDims.length; xi++) {
      heatData.push([xi, yi, heatRaw[yi][xi]]);
    }
  }

  var chartHeat = echarts.init(document.getElementById('chart-heat'), null, { renderer: 'svg' });
  chartHeat.setOption({
    animation: false,
    textStyle: { fontFamily: CJK },
    grid: { left: 72, right: 30, top: 34, bottom: 62 },
    tooltip: { appendToBody: true, backgroundColor: '#fff', borderColor: rule,
      textStyle: { color: ink, fontFamily: CJK, fontSize: 12 },
      formatter: function (p) {
        return heatGroups[p.value[1]] + ' · ' + heatDims[p.value[0]] +
               '<br/>得分：<b>' + p.value[2] + '</b> / 100';
      } },
    xAxis: {
      type: 'category', data: heatDims, splitArea: { show: false },
      axisLine: { lineStyle: { color: rule } }, axisTick: { show: false },
      axisLabel: { color: ink, fontFamily: CJK, fontSize: 11.5, interval: 0 }
    },
    yAxis: {
      type: 'category', data: heatGroups, splitArea: { show: false },
      axisLine: { lineStyle: { color: rule } }, axisTick: { show: false },
      axisLabel: { color: ink, fontFamily: CJK, fontSize: 12 }
    },
    visualMap: {
      min: 40, max: 90, calculable: true, orient: 'horizontal',
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
