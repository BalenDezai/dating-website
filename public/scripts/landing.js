function resize() {
    document.querySelector(".fill-screen").setAttribute("style","height:" + window.innerHeight + "px");
}

window.addEventListener("load", resize());

window.addEventListener("resize", resize());



// $(window).on("load resize", function () {
//     $(".fill-screen").css("height", window.innerHeight);
// });