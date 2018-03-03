function resize(){
    document.querySelector(".fill-screen").setAttribute("style","height:" + window.innerHeight + "px");
}

window.addEventListener("load", resize());

window.addEventListener("resize", resize());