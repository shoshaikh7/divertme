$(document).ready(function () {
  var SOURCES = [
    {
      sourceName: 'Giphy',
      hostURL: 'http://api.giphy.com/v1/gifs/',
      api_key: 'dc6zaTOxFJmzC',
      endpoint:  '',
      active: false,
      standardizeResponse: function (response) {

      }
    },
    {
      sourceName: 'Pixabay',
      hostURL: 'https://pixabay.com/api/',
      api_key: '3624782-4fe87a2472f88a89d9ff02cc6',
      endpoint: '',
      active: false,
      standardizeResponse: function (response) {

      }
    },
    {
      sourceName: 'RandomFamousQuotes',
      hostURL: 'https://andruxnet-random-famous-quotes.p.mashape.com/',
      api_key: 'cF7Ho2K5NgmshdUBdhZoqV3FORccp1urCayjsnhGRG4PHUL5jk',
      endpoint: '',
      active: false,
      standardizeResponse: function (response) {

      }
    }
  ]

  var Utils = {
    setDraggable: function () {
      $('.nav').draggable({
        scroll: false,
        revert: true,
        revertDuration: 500,
        start: function (e, ui) {
          $('#menu').css('border-radius', '50%');
          $('#menu-inner').css('opacity', '0.1');
          if ($(ui.helper[0]).is('#nav-up')) {
            $('#menu').css('border', '8px solid #c0392b');
          } else if ($(ui.helper[0]).is('#nav-right')) {
            $('#menu').css('border', '8px solid #27ae60');
          } else if ($(ui.helper[0]).is('#nav-down')) {
            $('#menu').css('border', '8px solid #2980b9');
          } else if ($(ui.helper[0]).is('#nav-left')) {
            $('#menu').css('border', '8px solid #f39c12');
          }
        },
        stop: function (e, ui) {
          $('#menu').css({'border': '8px solid #4f4e52', 'border-radius': '0'});
          $('#menu-inner').css('opacity', '0')
        }
      });
    }
  }

  var App = {
    init: function () {
      this.bindEvents();
    },
    bindEvents: function () {
      $('#menu').on('click', Utils.setDraggable);
    }
  }
  App.init()
});
