$(function () {
  var chartColors = pxDemo.getRandomColors(12);
  var curColorIndex = 0;
  
  (function () {
    var dataAgama = {
      columns: [
        ['Islam', 750],
        ['Kristen', 100],
        ['Hindu', 100],
        ['Budha', 50]
      ],
      type: 'pie',
    };

    var dataGoldar = {
      columns: [
        ['A', pxDemo.getRandomData(300, 50)],
        ['B', pxDemo.getRandomData(300, 50)],
        ['AB', pxDemo.getRandomData(300, 50)],
        ['O', pxDemo.getRandomData(300, 50)],
      ],
      type: 'pie',
    };

    var dataGender = {
      columns: [
        ['Pria', pxDemo.getRandomData(300, 50)],
        ['Wanita', pxDemo.getRandomData(300, 50)],
      ],
      type: 'pie',
    };

    var dataNikah = {
      columns: [
        ['Sudah', pxDemo.getRandomData(300, 50)],
        ['Belum', pxDemo.getRandomData(300, 50)],
      ],
      type: 'pie',
    };

    var dataJob = {
      columns: [
        ['Wirausaha', pxDemo.getRandomData(300, 50)],
        ['Karyawan Swasta', pxDemo.getRandomData(300, 50)],
        ['Pegawai Negeri Sipil', pxDemo.getRandomData(300, 50)],
        ['Belum Bekerja', pxDemo.getRandomData(300, 50)],
        ['Lainnya', pxDemo.getRandomData(300, 50)],
      ],
      type: 'pie',
    };

    var dataStudi = {
      columns: [
        ['Sarjana', pxDemo.getRandomData(300, 50)],
        ['SMA', pxDemo.getRandomData(300, 50)],
        ['Diploma 1', pxDemo.getRandomData(300, 50)],
        ['Master', pxDemo.getRandomData(300, 50)],
        ['SMP', pxDemo.getRandomData(300, 50)],
      ],
      type: 'pie',
    };

    c3.generate({
      bindto: '#agama-chart',
      color: { pattern: [chartColors[8], chartColors[9], chartColors[10], chartColors[11]] },
      data: dataAgama,
      legend: { position: 'right' }
    });

    c3.generate({
      bindto: '#goldar-chart',
      color: { pattern: [chartColors[8], chartColors[9], chartColors[10], chartColors[7]] },
      data: dataGoldar,
      legend: { position: 'right' }
    });

    c3.generate({
      bindto: '#nikah-chart',
      color: { pattern: [chartColors[8], chartColors[9]] },
      data: dataNikah,
      legend: { position: 'right' }
    });

    c3.generate({
      bindto: '#gender-chart',
      color: { pattern: [chartColors[8], chartColors[9], chartColors[10]] },
      data: dataGender,
      legend: { position: 'right' }
    });

    c3.generate({
      bindto: '#job-chart',
      color: { pattern: [chartColors[8], chartColors[9], chartColors[10]] },
      data: dataJob,
      legend: { position: 'right' }
    });

    c3.generate({
      bindto: '#studi-chart',
      color: { pattern: [chartColors[8], chartColors[9], chartColors[10], chartColors[1], chartColors[3]] },
      data: dataStudi,
      legend: { position: 'right' }
    });

  })();
});