$(document).ready(function(){

  // mobile menu open/close
  var mobileCont = $('.mobile-cont')
  var mainCont = $('main')
  var bodyCont = $('body')
  $('header .mobile-cont button').click(function(){
    bodyCont.toggleClass('scroll-lock')
    mobileCont.toggleClass('active')
    mainCont.toggleClass('overlay')
  })
  $('header .mobile-menu a').click(function() {
    bodyCont.removeClass('scroll-lock')
    mobileCont.removeClass('active')
    mainCont.removeClass('overlay')
  })

  // intersection observer factory
  function createObserver(options, target, handleIntersect) {
    var observer = new IntersectionObserver(handleIntersect, options)
    observer.observe(target)
    return observer
  }
  function destroyObserver(target, observer) {
    observer.unobserve(target)
  }

  // header intersection observer settings
  var header = $(".header")
  function darkenHeader(entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting && entries[i].intersectionRatio >=0.75) {
        header.removeClass("darken")
      } 
      else {
        header.addClass("darken")
      }
    }
  }
  var headerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.75
  }
  var hero = document.querySelector('.hero');
  var headerObserver
  headerObserver = createObserver(headerOptions, hero, darkenHeader)

  // Stats slider
  var stats = $(".stats .main-slider")
  var bg = $(".stats .bg-slider")

  // zero numbers out on init
  stats.on('init reInit', function(event){
    var slides = stats.find(".slide")
    $.each(slides, function(key, value) {
      var numDigits = $(value).attr("data-target").length
      var numCont = $(value).find(".num-cont")
      var digits = $(numCont).find(".digit")
      if (digits.length > 0){
        for (let i = 0; i < numDigits; i++) {
          $.each(digits, function(key, value){
            $(value).text('0')
          })
        }
      } else {
        for (let i = 0; i < numDigits; i++) {
          numCont.append( "<div class='digit'>0</div>" )
        }
      }
    })
  })

  stats.slick({
    slide: '.slide',
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: '.stats .controls .prev',
    nextArrow: '.stats .controls .next',
    fade: true,
    asNavFor: '.stats .bg-slider',
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          vertical: true,
          fade: false,
          prevArrow: '.stats .controls-large .prev',
          nextArrow: '.stats .controls-large .next',
        }
      }
    ]
  });
  bg.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.stats .main-slider'
  });

  // Zero out before change to next slide
  stats.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
    var digits = $(slick.$slides[nextSlide]).find(".num-cont").find(".digit");
    $.each(digits, function(key, value){
      $(value).text('0')
    })
  })

  // Animate number change for new slide
  stats.on('afterChange', function(event, slick, currentSlide) {
    var num = 0;
    var targetNodes = $(slick.$slides[currentSlide]).find(".num-cont").find(".digit");
    var targetNum = $(slick.$slides[currentSlide]).attr("data-target");
    $.each(targetNodes, function(key, value){
      animIncrement(num, targetNum[key], value )
    })
  })

  // number animation function
  function animIncrement(num, target, node) {
    var statsInterval
    clearInterval(statsInterval)
    statsInterval = setInterval(function() {
      $(node).text(num)
      if(num >= target) clearInterval(statsInterval)
      num++
    }, 30)
  }

  // first stats animation on load
  var firstNode = $(stats).find(".slick-current")
  var firstTargetNum = firstNode.attr("data-target")
  var firstTargetNodes = firstNode.find(".num-cont").find(".digit")

  $.each(firstTargetNodes, function(key, value){
    animIncrement(0, firstTargetNum[key], value)
  })
});