
var x, i, j, l, ll, selElmnt, a, b, c;

/*look for any elements with the class "selct-dropdown":*/
x = document.getElementsByClassName("selct-dropdown");

l = x.length;
for (i = 0; i < l; i++) {
  var first_select_child = x[i].getElementsByTagName('select')[0];

  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/

  var selid = selElmnt.getAttribute('id');
  b = document.createElement("DIV");
  //b.setAttribute("class", "select-items select-hide boxscroll");
  setAttributes(b, { "class": "select-items select-hide boxscroll", "data-id": selid });

  /*$('.select-items').prepend(`<input type="text" placeholder="Ara" class="selectFilterInput">`);*/
  c = document.createElement("INPUT");
  setAttributes(c, { 'type': 'text', 'placeholder': 'Ara', 'class': 'selectFilterInput' });
  b.appendChild(c);

  for (j = 1; j < ll; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function (e) {
      /*when an item is clicked, update the original select box,
      and the selected item:*/
      var y, i, k, s, h, sl, yl;
      s = this.parentNode.parentNode.getElementsByTagName("select")[0];
      sl = s.length;
      h = this.parentNode.previousSibling;
      var selectid = s.getAttribute('id');
      for (i = 0; i < sl; i++) {
        if (s.options[i].innerHTML == this.innerHTML) {
          s.selectedIndex = i;
          h.innerHTML = this.innerHTML;
          y = this.parentNode.getElementsByClassName("same-as-selected");
          yl = y.length;
          for (k = 0; k < yl; k++) {
            y[k].removeAttribute("class");
          }
          this.setAttribute("class", "same-as-selected");

          if (selectid != null) {
            const e = new Event("change");
            const element = document.querySelector('#' + selectid)
            element.dispatchEvent(e);
          }
          break;
        }
      }
      h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function (e) {

    e.stopPropagation();
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
    $(this).next().find("input").get(0).focus();
  });
}

function closeAllSelect(e) {

  if (!$(e.target).hasClass("select-items") && $(e.target).parents(".select-items").length == 0) {
    $(".select-items").addClass("select-hide");
    $(".select-selected").removeClass("select-arrow-active");
  }
}

document.addEventListener("click", closeAllSelect);


function setAttributes(el, options) {
  Object.keys(options).forEach(function (attr) {
    el.setAttribute(attr, options[attr]);
  })
}

$(document.body).on("input change", ".selectFilterInput", function () {
  const div = $(this).parent().children("div");
  const search = $(this).val();
  if (search != "")
    div.slideUp(0).filter(function (k) {
      if ($(this).text().toLowerCase().indexOf(search) < 0)
        return;
      return $(this);
    }).slideDown(0);
  else
    div.slideDown(0)
})
