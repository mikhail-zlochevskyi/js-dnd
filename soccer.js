

document.body.onmousedown = function(e) {
  e = fixEvent(e);

  var dragElement = e.target;

  if (!hasClass(dragElement, 'draggable')) return;

  var coords, shiftX, shiftY;
  
  startDrag(e.pageX, e.pageY);


  document.onmousemove = function(e) {
    e = fixEvent(e);
    moveAt(e.pageX, e.pageY);
  }

  dragElement.onmouseup = function() {
    finishDrag();
  }


  // -------------------------

  function startDrag(pageX, pageY) {

    coords = getCoords(dragElement);
    shiftX = pageX - coords.left;
    shiftY = pageY - coords.top;
   
    addClass(dragElement, "dragging");
    dragElement.style.position = 'absolute';
    document.body.appendChild(dragElement); 

    moveAt(pageX, pageY);
  }

  function finishDrag() {
    removeClass(dragElement, 'dragging');
    document.onmousemove = dragElement.onmouseup = null;
  }

  function moveAt(pageX, pageY) {
    var newX = pageX - shiftX; 
    var newY = pageY - shiftY; 

    var newBottom = newY + dragElement.offsetHeight;

    var docScroll = getDocumentScroll();

    // прокрутить вниз, если нужно
    if (newBottom > docScroll.bottom) {
      // ...но не за конец документа
      var scrollSizeToEnd = docScroll.height - docScroll.bottom;

      // scrollBy, если его не ограничить,
      // может заскроллить за текущую границу страницы
      var toScrollY = Math.min(scrollSizeToEnd, 10);
      window.scrollBy(0, toScrollY );

      // при необходимости двигаем элемент вверх, чтобы поместился
      // метод scrollBy асинхронный, поэтому учитываем будущую прокрутку (+toScrollY)
      newY = Math.min(newY, docScroll.bottom - dragElement.offsetHeight + toScrollY);
    }

    if (newY < docScroll.top) {
      var toScrollY = Math.min(docScroll.top, 10);
      window.scrollBy(0, -toScrollY );
      newY = Math.max(newY, docScroll.top - toScrollY );
    }
   
    dragElement.style.left = newX + 'px';
    dragElement.style.top = newY + 'px';
  }

  return false;
}
