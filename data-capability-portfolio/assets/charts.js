(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg = style.getPropertyValue('--bg').trim();

  function fallback(id, msg) {
    var el = document.getElementById(id);
    if (el) {
      el.innerHTML = '<p style="color:' + muted + ';font-size:0.85rem;padding:1rem 0;">' + msg + '</p>';
    }
  }

  if (typeof echarts === 'undefined') {
    fallback('chart-effect', '图表需要联网加载 ECharts 组件，请刷新页面重试。');
    fallback('chart-scatter', '图表需要联网加载 ECharts 组件，请刷新页面重试。');
    return;
  }

  var projects = ['山区支教行动', '阳光义卖公益', '社区敬老陪伴', '图书馆志愿服务', '医院导诊服务', '环保净滩活动'];
  var effectScore = [92, 90, 88, 81, 79, 76];

  // --- 图 1：各项目成效指数 ---
  var el1 = document.getElementById('chart-effect');
  if (el1) {
    var chart1 = echarts.init(el1, null, { renderer: 'svg' });
    chart1.setOption({
      animation: false,
      grid: { left: 112, right: 76, top: 32, bottom: 56 },
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        axisPointer: { type: 'shadow' },
        formatter: function (p) {
          return p[0].name + '<br/>成效指数：' + p[0].value + ' 分';
        }
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 100,
        name: '成效指数',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: { color: muted, fontSize: 12 },
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false },
        axisLabel: { color: muted, fontSize: 12 },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      yAxis: {
        type: 'category',
        data: projects,
        inverse: true,
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false },
        axisLabel: { color: ink, fontSize: 13 }
      },
      series: [
        {
          type: 'bar',
          data: effectScore,
          barWidth: 22,
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
            color: function (params) {
              return params.value >= 90 ? accent : accent + '99';
            }
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}',
            color: ink,
            fontSize: 12,
            fontWeight: 'bold'
          },
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: { color: muted, type: 'dashed', width: 1 },
            label: {
              formatter: '均值 84.3',
              position: 'end',
              color: muted,
              fontSize: 11
            },
            data: [{ xAxis: 84.3 }]
          }
        }
      ]
    });
    window.addEventListener('resize', function () { chart1.resize(); });
  }

  // --- 图 2：服务时长 × 成效指数 ---
  var el2 = document.getElementById('chart-scatter');
  if (el2) {
    var chart2 = echarts.init(el2, null, { renderer: 'svg' });
    chart2.setOption({
      animation: false,
      grid: { left: 64, right: 56, top: 40, bottom: 56 },
      tooltip: {
        trigger: 'item',
        appendToBody: true,
        formatter: function (p) {
          return p.value[2] + '<br/>服务时长：' + p.value[0] + ' h<br/>成效指数：' + p.value[1] + ' 分';
        }
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 400,
        name: '服务时长（小时）',
        nameLocation: 'middle',
        nameGap: 32,
        nameTextStyle: { color: muted, fontSize: 12 },
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false },
        axisLabel: { color: muted, fontSize: 12 },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      yAxis: {
        type: 'value',
        min: 70,
        max: 96,
        name: '成效指数',
        nameGap: 14,
        nameTextStyle: { color: muted, fontSize: 12 },
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false },
        axisLabel: { color: muted, fontSize: 12 },
        splitLine: { lineStyle: { color: rule, type: 'dashed' } }
      },
      series: [
        {
          type: 'scatter',
          symbolSize: 13,
          itemStyle: {
            color: accent,
            borderColor: bg,
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'top',
            formatter: function (p) { return p.value[2]; },
            color: ink,
            fontSize: 11
          },
          labelLayout: { hideOverlap: true },
          data: [
            [120, 88, '社区敬老陪伴'],
            [360, 92, '山区支教行动'],
            [70, 76, '环保净滩活动'],
            [90, 81, '图书馆志愿服务'],
            [16, 90, '阳光义卖公益'],
            [48, 79, '医院导诊服务']
          ],
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: { color: accent2, type: 'dashed', width: 1 },
            label: {
              formatter: '均值 84.3',
              position: 'insideEndTop',
              color: accent2,
              fontSize: 11
            },
            data: [{ yAxis: 84.3 }]
          }
        }
      ]
    });
    window.addEventListener('resize', function () { chart2.resize(); });
  }
})();
