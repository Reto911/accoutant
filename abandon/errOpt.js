function date() {
    return {
      options: {
        title: {
          text: "支出成分"
        },
        tooltip: {},
        legend: {
          data: [
            "Food",
            "Play",
            "Other"
          ]
        },
        series: [
          {
            name: "支出",
            type: "pie",
            data: [
              {value: 720, name: "Food"},
              {value: 350, name: "Play"},
              {value: 320, name: "Other"}
            ]
          }
        ]
      },
    }
  }