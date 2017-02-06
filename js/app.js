$(document).ready(function () {
  var SOURCES = [
    {
      sourceName: 'Giphy',
      sourceAlias: 'GifMe',
      hostURL: 'https://api.giphy.com/v1/gifs/',
      api_key: 'dc6zaTOxFJmzC',
      endpoint:  '',
      active: false,
      standardizeResponse: function (response) {
        var gif = response.data;
        var rand = Math.floor(Math.random() * 100);
        if (this.endpoint === "random") {
          return {
            gif: gif.image_url
          };
        } else {
          return {
            gif: gif[rand].images.original.url
          };
        }
      }
    },
    {
      sourceName: 'Pixabay',
      sourceAlias: 'ImageMe',
      hostURL: 'https://pixabay.com/api/',
      api_key: '3624782-4fe87a2472f88a89d9ff02cc6',
      endpoint: '',
      active: false,
      standardizeResponse: function (response) {
        var data = response.hits;
        var rand = Math.floor(Math.random() * 20);
        for (var i = rand; i < data.length; i++) {
          return {
            image: data[i].webformatURL,
            tags: data[i].tags,
            link: data[i].pageURL
          };
        }
      }
    },
    {
      sourceName: 'RandomFamousQuotes',
      sourceAlias: 'InspireMe',
      hostURL: 'https://andruxnet-random-famous-quotes.p.mashape.com/',
      api_key: 'cF7Ho2K5NgmshdUBdhZoqV3FORccp1urCayjsnhGRG4PHUL5jk',
      endpoint: '',
      active: false,
      standardizeResponse: function (response) {
        return {
          quote: response.quote,
          author: response.author
        };
      }
    }
  ]

  var Utils = {
    setDraggable: function () {
      $('.nav').draggable({
        scroll: false,
        revert: true,
        revertDuration: 500,
        stop: function (e, ui) {
          $('#menu').css({'border': '8px solid #4f4e52', 'border-radius': '7px'});
          $('#menu-inner').css('opacity', '0');
        }
      });
    },
    setDroppable: function () {
      $('#menu').droppable({
        accept: '.nav',
        drop: function (e, ui) {
          var source = ui.helper[0].dataset.cat;
          App.setActiveSource(source)
        },
        over: function (e, ui) {
          $('#menu').css('border-radius', '50%');
          $('#menu-inner').css('opacity', '0.1');
          if ($(ui.helper[0]).is('#nav-up')) {
            $(this).animate({borderColor: "#c0392b"}, 500, "easeInOutCirc");
          } else if ($(ui.helper[0]).is('#nav-right')) {
            $(this).animate({borderColor: "#27ae60"}, 500, "easeInOutCirc");
          } else if ($(ui.helper[0]).is('#nav-down')) {
            $(this).animate({borderColor: "#2980b9"}, 500, "easeInOutCirc");
          } else if ($(ui.helper[0]).is('#nav-left')) {
            $(this).animate({borderColor: "#f39c12"}, 500, "easeInOutCirc");
          }
        }
      });
    }
  }

  var App = {
    init: function () {
      this.bindEvents();
    },
    bindEvents: function () {
      $('#menu').on('click', App.showNav);
      $('#menu').on('click', Utils.setDraggable);
      $('#menu').on('click', Utils.setDroppable);
      $('#search button').on('click', App.searchSource);
    },
    activeSource: null,
    setActiveSource: function (source) {
      console.log(this)
      console.log(source);
      if (source === "Unavailable") {
        alert("Unavailable");
      } else if (source === "GifMe" || source === "ImageMe" || source === "InspireMe") {
        var source = _.findWhere(SOURCES, {sourceAlias: source});
        if (source.sourceName !== "RandomFamousQuotes") {
          $('#search-title p span')[0].innerText = source.sourceName;
        }
        source.active = true;
        this.activeSource = source;
      } else {
        var endpoint = source;
        this.activeSource.endpoint = endpoint;
      }
      this.setCat(this.activeSource);
      if (endpoint) {
        this.changeSource();
      }
    },
    searchSource: function () {
      var source = App.activeSource;
      if (App.source === null) {
        alert("Please select a source by clicking on the menu box first")
      }
      var searchVal = $($(this).siblings()[1]).val().trim();
      source.endpoint = "search"
      App.changeSource(searchVal)
    },
    changeSource: function (searchVal) {
      if (this.activeSource.endpoint === "main") {
        this.defaultSource();
      } else {
        var request;
        var source = this.activeSource.sourceName;
        var baseURL = this.activeSource.hostURL;
        var endpoint = this.activeSource.endpoint;
        var api_key = this.activeSource.api_key;
        if (source === "Giphy") {
          request =  this.requestGif(baseURL, endpoint, searchVal, api_key);
        } else if (source === "Pixabay") {
          request = this.requestImage(baseURL, endpoint, searchVal, api_key);
        } else if (source === "RandomFamousQuotes") {
          request = this.requestQuote(baseURL, endpoint, searchVal, api_key);
        }
        request.done(this.handleResponse);
      }
    },
    requestGif: function (baseURL, endpoint, searchVal, api_key) {
      if (endpoint === "sports") {
        endpoint = "search";
      }
      var url = baseURL + endpoint;
      if (endpoint === "random" || endpoint === "trending") {
        return $.ajax(url, {
          dataType: 'json',
          data: {
            api_key: api_key,
            limit: "100"
          }
        });
      } else {
        return $.ajax(url, {
          dataType: 'json',
          data: {
            api_key: api_key,
            q: searchVal,
            limit: "100"
          }
        });
      }
    },
    requestImage: function (baseURL, endpoint, searchVal, api_key) {
      if (endpoint === "search") {
        return $.ajax(baseURL, {
          dataType: 'json',
          data: {
            q: searchVal,
            key: api_key
          }
        });
      } else {
        return $.ajax(baseURL, {
          dataType: 'json',
          data: {
            category: endpoint,
            key: api_key
          }
        });
      }
    },
    requestQuote: function (baseURL, endpoint, searchVal, api_key) {
      return $.ajax(baseURL, {
        dataType: 'json',
        data: {
          cat: endpoint
        },
        beforeSend: function (xhr) {
          xhr.setRequestHeader("X-Mashape-Authorization", api_key)
        }
      });
    },
    handleResponse: function (response) {
      var formattedResponse = App.activeSource.standardizeResponse(response);
      var source = App.activeSource.sourceName;
      if (source === "Giphy") {
        $("#content").html('<img src=' + formattedResponse.gif + ' style="height:100%;width:100%">')
      } else if (source === "Pixabay") {
        $("#content").html('<div id="image"><a href="' + formattedResponse.link + '" target="_blank"><img src=' + formattedResponse.image + '></a></div>');
        $("#content").append('<div id="sub-text"><h2>' + formattedResponse.tags + '</h2></div>');
      } else if (source === "RandomFamousQuotes") {
        $("#content").html('<h1 style="text-align:center">"' + formattedResponse.quote + '"</h1>');
        $("#content").append('<div id="sub-text"><h2>-' + formattedResponse.author + '</h2></div>');
      }
    },
    setCat: function (source) {
      var $navUp = $('#nav-up')[0];
      var $navRight = $('#nav-right')[0];
      var $navDown = $('#nav-down')[0];
      var $navLeft = $('#nav-left')[0];

      if (source.sourceName === "Giphy") {
        $navUp.dataset.cat = "random";
        $navRight.dataset.cat = "trending";
        $navDown.dataset.cat = "main";
        $navLeft.dataset.cat = "sports";
      } else if (source.sourceName === "RandomFamousQuotes") {
        $navUp.dataset.cat = "famous";
        $navRight.dataset.cat = "main";
        $navDown.dataset.cat = "movies";
        $navLeft.dataset.cat = "unavailable";
      } else if (source.sourceName === "Pixabay") {
        $navUp.dataset.cat = "nature";
        $navRight.dataset.cat = "animals";
        $navDown.dataset.cat = "food";
        $navLeft.dataset.cat = "main";
      }
    },
    defaultSource: function () {
      var $navUp = $('#nav-up')[0];
      var $navRight = $('#nav-right')[0];
      var $navDown = $('#nav-down')[0];
      var $navLeft = $('#nav-left')[0];

      $navUp.dataset.cat = "GifMe";
      $navRight.dataset.cat = "ImageMe";
      $navDown.dataset.cat = "Unavailable";
      $navLeft.dataset.cat = "InspireMe";

      $('#content').html('<div id="info"><p><span>Drag</span> one of the <span>circles</span> inside the <span>box</span> to select a different <span>source</span>.</p></div>')
    },
    showNav: function () {
      $('#nav-up').position({
        my: 'center',
        at: 'top',
        of: '#menu-outter',
        using: function (position) {
          $(this).animate({
            top: position.top,
            left: position.left,
            opacity: 1
          }, 1000)
        }
      });
      $('#nav-right').position({
        my: 'center',
        at: 'right',
        of: '#menu-outter',
        using: function (position) {
          $(this).animate({
            top: position.top,
            left: position.left,
            opacity: 1
          }, 1000)
        }
      });
      $('#nav-down').position({
        my: 'center',
        at: 'bottom',
        of: '#menu-outter',
        using: function (position) {
          $(this).animate({
            top: position.top,
            left: position.left,
            opacity: 1
          }, 1000)
        }
      });
      $('#nav-left').position({
        my: 'center',
        at: 'left',
        of: '#menu-outter',
        using: function (position) {
          $(this).animate({
            top: position.top,
            left: position.left,
            opacity: 1
          }, 1000)
        }
      });


      $('.labels li p').animate({opacity: 1}, 1000);
      $('#search label p span').animate({opacity: 1}, 1000);
      $('#red p')[0].innerText = $('#nav-up')[0].dataset.cat;
      $('#green p')[0].innerText = $('#nav-right')[0].dataset.cat;
      $('#blue p')[0].innerText = $('#nav-down')[0].dataset.cat;
      $('#yellow p')[0].innerText = $('#nav-left')[0].dataset.cat;
    }
  }
  App.init()
});
