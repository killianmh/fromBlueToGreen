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


  // how section animation intersection observer settings
  var tl = gsap.timeline({repeat: -1})
  var howObserver
  var how = document.querySelector('.how');
  var howOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5
  }

  function handleHowAnim(entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting && entries[i].intersectionRatio >=0.5) {
          animInit()
          svgAnim()
        } 
        else {
          tl.kill()
          animInit()
        }
    }
  }


  // Resizing event listener for how section animation
  var timeout = false
  var delay = 250 
  
  function getDimensions() {
    var width = window.innerWidth
    // kill how section svg animation on resize
    tl.kill()
    
    // run how section animation for screens > 1024; otherwise, show static cards
    if (width > 1024) {
      // initialize how section svg animation
      animInit()
      // observe how section
      howObserver = createObserver(howOptions, how, handleHowAnim)
    } else {
      // show mobile view for how section
      init()
      if (howObserver != undefined) {
        // destroy how section observer
        destroyObserver(how, howObserver)
      }
    }
  }

  window.addEventListener('resize', function() {
    // clear timeout
    clearTimeout(timeout)
    // start timing for event completion
    timeout = setTimeout(getDimensions, delay)
  })

  getDimensions()

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



  // Showcase slider
  var showcase = $(".showcase .slider")
  showcase.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: '.showcase .controls .prev',
    nextArrow: '.showcase .controls .next',
    fade: false,
  });


  // How section settings and animation

  // initialize how section mobile
  function init() {
    var init = gsap.timeline()
    init.set("#step-one",{autoAlpha:1});
    init.set("#step-two",{autoAlpha:1});
    init.set("#step-three",{autoAlpha:1});
  }
  
  // initialize how section desktop
  function animInit() {
    var svgInit = gsap.timeline()
    svgInit.set(".svg-target",{autoAlpha:0});
    svgInit.set("#step-one",{autoAlpha:0});
    svgInit.set("#step-two",{autoAlpha:0});
    svgInit.set("#step-three",{autoAlpha:0});
    svgInit.set(".svg",{ autoAlpha:0});
    svgInit.set(".svg",{ rotation: 0});
    svgInit.set(".svg-truck",{ autoAlpha:0});
  }

  // how section desktop animation
  function svgAnim() {
    tl.kill()
    var readTime = "+=2"

    tl.restart()

    tl.to(".svg", {duration: 1, autoAlpha:1})
    tl.to("#step-one", {duration: 1, autoAlpha:1}, "<")
    tl.to(".svg-truck", {duration: 1, autoAlpha:1})
    tl.to(".svg", {duration: 4, rotation: -120, transformOrigin:"49% 57%"})
    tl.to(".svg-truck", {duration: 0.4, repeat: 7, yPercent: -15, yoyo: true}, "<")
    tl.to("#hospital-group", {duration: 1, autoAlpha:1}, "<1")
    tl.to(".svg-truck", {duration: 1, autoAlpha:0})
    tl.to("#step-one", {duration: 1, autoAlpha:0}, readTime)
    
    tl.to("#step-two", {duration: 1, autoAlpha:1},"+=0.5")
    tl.to(".svg-truck", {duration: 1, autoAlpha:1})
    tl.to(".svg", {duration: 4, rotation: -240, transformOrigin:"49% 57%"})
    tl.to(".svg-truck", {duration: 0.4, repeat: 7, yPercent: -15, yoyo: true}, "<")
    tl.to("#hospital-group", {duration: 1, autoAlpha:0}, "<")
    tl.to("#sewing-group", {duration: 1, autoAlpha:1}, "<1")
    tl.to(".svg-truck", {duration: 1, autoAlpha:0})
    tl.to("#step-two", {duration: 1, autoAlpha:0}, readTime)
    
    tl.to("#step-three", {duration: 1, autoAlpha:1})
    tl.to(".svg-truck", {duration: 1, autoAlpha:1})
    tl.to(".svg", {duration: 4, rotation: -360, transformOrigin:"49% 57%"})
    tl.to(".svg-truck", {duration: 0.4, repeat: 7, yPercent: -15, yoyo: true}, "<")
    tl.to("#sewing-group", {duration: 1, autoAlpha:0}, "<")
    tl.to("#ppl-group", {duration: 1, autoAlpha:1}, "<1")
    tl.to(".svg-truck", {duration: 1, autoAlpha:0})
    tl.to("#step-three", {duration: 1, autoAlpha:0}, readTime)

    tl.to("#ppl-group", {duration: 1, autoAlpha:0}, "<")
    tl.to(".svg", {duration: 1, autoAlpha:0}, "<")
    tl.to(".svg", {duration: 0.5, rotation: 0, transformOrigin:"49% 57%"})
  }
});