

function loadVideo(slide) {
    if (typeof slide?.url !== "undefined") {
        let _t = $(!slide.url.includes("https://www.youtube.com/") ? '#videoTemplate' : '#youtubeTemplate').clone().html();
        s.append(_t.replace("{src}", slide?.url));
    } else
        console.error("Slide url not found")

}

function loadPdf(slide) {
    if (typeof slide?.url !== "undefined") {
        let _t = $('#pdfTemplate').clone().html();
        s.append(_t.replace("{src}", slide.url));
        // _pv.push({ "file": slide.url, "view": loadThePdf(slide.url) })
    } else
        console.error("Slide url not found")
}

function loadPodcast(slide) {
    if (slide.list.length > 0) {
        let _t = $('#podcastTemplate').clone().html();
        s.append(_t);
        new Player(slide.list, $('.slide:last-child'));
    } else {
        console.log("Herhangi bir podcast bulunamadÄ±!");
    }
}

function loadSlider(slide) {
    let _t = $('#sliderTemplate').clone().html();

    s.append(_t.replace("{photos}", slide.photos.map((k) => `<div class="swiper-slide"><img src="${k}"></div>`).join(" ")));
    if (slide.photos.length < 2)
        $('.slide:last-child .leftSlide,.slide:last-child .nextSlide').remove();

    const len = slide.photos.length;
    let $s = new Swiper('.slide:last-child .swiper', {
        grabCursor: true,
        navigation: {
            prevEl: '.slide:last-child .leftSlide i',
            nextEl: '.slide:last-child .nextSlide i',
        },
        on: {
            init: function (e) {
                $(e.$el.parent()).find('.leftSlide').css({ "opacity": 0, "pointer-events": "none" });
            },
            slideChange: function (e) {

                if (len == e.activeIndex + 1) {
                    $(e.$el.parent()).find('.leftSlide').removeAttr("style");
                    $(e.$el.parent()).find('.nextSlide').css({ "opacity": 0, "pointer-events": "none" });
                    $(e.$el.parent()).find('.nextLesson,.finishLesson').css("display", "unset").fadeIn(0);
                } else if (e.activeIndex == 0) {
                    $(e.$el.parent()).find('.nextSlide').removeAttr("style");
                    $(e.$el.parent()).find('.leftSlide').css({ "opacity": 0, "pointer-events": "none" });
                } else {
                    $(e.$el.parent()).find('.leftSlide,..nextSlide').removeAttr("style");
                }
            }
        }
    });
}

function loadQuestion(slide) {
    $('.nextLesson').fadeOut();

    let _t = $('#questionTemplate').clone().html();
    s.append(_t.replace("{title}", slide.title).replace("{answers}", slide.answers.map((k) => `<button class="question-button">${k?.name ?? k}</button>`).join(" ")));
}
function loadThePdf(_FILE) {
    let PDFFILE = encodeURI(_FILE);
    function dataURItoBinArray(data) {
        var binary = atob(data);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Uint8Array(array);
    }
    $(document.body).on("change", '#opendoc', function (e) {
        let file = e.target;
        let reader = new FileReader();
        reader.onload = async function () {
            await pdfViewer.loadDocument({ data: dataURItoBinArray(reader.result.replace(/^data:.*;base64,/, "")) });
            await pdfThumbnails.loadDocument({ data: dataURItoBinArray(reader.result.replace(/^data:.*;base64,/, "")) }).then(() => pdfThumbnails.setZoom("fit"));
        }
        if (file.files.length > 0) {
            reader.readAsDataURL(file.files[0]);
            document.querySelector('#filedownload').download = document.querySelector('#opendoc').files[0].name;
        }
    })


    let _t = $('#pdfTemplate').clone().html();
    s.append(_t);
    $('.pdfcontainer').css("max-width", $('.slide:first-child').outerWidth());
    const _p = $(`.pdfcontainer:nth-child(${_pv.length + 1})`).attr("data-pdf", _pv.length);

    const pdfViewer = new PDFjsViewer(_p.find(".maindoc"), {
        zoomValues: [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4],

        onZoomChange: function (zoom) {
            zoom = parseInt(zoom * 10000) / 100;
            $('.zoomval').text(zoom + '%');
        },

        onActivePageChanged: function (page) {
            let pageno = $(page).data('page');
            let pagetotal = this.getPageCount();
            _p.find('.pageno').text(pageno);
            _p.find('.pageno').attr('max', pagetotal);
            _p.find('.pagecount').text('de ' + pagetotal);
        },
        onDocumentReady: function () {
            pdfViewer.setZoom('fit');
            pdfViewer.pdf.getData().then(function (data) {
                // document.querySelector('#filedownload').href = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
                // document.querySelector('#filedownload').target = '_blank';
            });
        }
    });
    pdfViewer.loadDocument(PDFFILE).then(function () {
        // document.querySelector('#filedownload').download = PDFFILE;
    });
    let pdfThumbnails = new PDFjsViewer(_p.find(".thumbnails"), {
        zoomFillArea: 0.7,
        onNewPage: function (page) {
            page.on('click', function () {
                if (!pdfViewer.isPageVisible(page.data('page'))) {
                    pdfViewer.scrollToPage(parseInt(page.data('page')));
                }
            })
        },
        onDocumentReady: function () {
            this.setZoom('fit');
        }
    });

    pdfThumbnails.setActivePage = function (pageno) {
        _p.find(".thumbnails").find('.pdfpage').removeClass('selected');
        let $npage = _p.find(".thumbnails").find('.pdfpage[data-page="' + pageno + '"]').addClass('selected');
        if (!this.isPageVisible(pageno)) {
            this.scrollToPage(pageno);
        }
    }.bind(pdfThumbnails);

    pdfThumbnails.loadDocument(PDFFILE);
    return pdfViewer;
}


$(document).resize(function () {
    $('.pdfcontainer').css("max-width", $('.slide:first-child').outerWidth());
})

function pdfViewer(e, file = false) {
    const _view = $(e).parents(".pdfcontainer").data("pdf");
    if (typeof _view !== "undefined" && _view >= 0) {
        if (!file)
            return _pv[parseInt(_view)].view;
        return _pv[parseInt(_view)].file;
    }
    return;
}
function goToPage(e, i) {
    pdfViewer(e).scrollToPage(i < 0 ? pdfViewer(e).pdf.numPages : i);
}
function setZoom(e, zoom) {
    pdfViewer(e).setZoom(zoom);
}
function nextPdf(e) {
    pdfViewer(e).next();
}
function prevPdf(e) {
    pdfViewer(e).prev();
}

function downloadPdf(e) {
    window.open(pdfViewer(e, true), '_blank');
}

function setHorizontal(e) {

    $(e).parents(".pdfcontainer").find(".maindoc").addClass("horizontal-scroll");
    pdfViewer(e).refreshAll();
}

function setVertical(e) {
    $(e).parents(".pdfcontainer").find(".maindoc").removeClass("horizontal-scroll");
    pdfViewer(e).refreshAll();
}
function togglethumbs(el) {
    if (el.classList.contains('pushed')) {
        el.classList.remove('pushed');
        document.querySelector('.thumbnails').classList.add('hide');
    } else {
        el.classList.add('pushed');
        document.querySelector('.thumbnails').classList.remove('hide');
    }
}