$('.dropdown-item').click(function(e) {
    var name = e.currentTarget;
    console.log(name);
    console.log(name.getAttribute("data-name"));
});