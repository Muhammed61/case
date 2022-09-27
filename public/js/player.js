class Player {
    static playerList = [];
    constructor(list, element) {
        if (list.length === 0) {
            console.error("Bir liste bulunamadı")
            return;
        }
        Player.playerList.push(this)
        this.list = list;
        this.track_index = 0;
        this.curr_track = document.createElement('audio')
        this.target = element
        this.trackName = $(this.target).find(".track-name")
        this.trackArtist = $(this.target).find(".track-artist")
        this.trackSeek = $(this.target).find(".track-length");
        this.currentTime = $(this.target).find(".current-time")
        this.totalDuration = $(this.target).find(".total-duration")
        this.seek_slider = $(this.target).find(".seek_slider")


        this.updateTimer;
        this.load()

        let _this = this;
        this.target.find(".player").fadeIn();
        $(document.body).find($(this.target).find(".playpause-track")).click(function () {
            if ($(this).attr("class").split(/\s+/).includes("play-track")) {
                _this.play()
                $(this).removeClass("play-track")
                $(this).html('<i class="fa-solid fa-pause"></i>')
            }
            else {
                _this.pause()
                $(this).html('<i class="fa-solid fa-play"></i>')
                $(this).addClass("play-track")
            }
        })
        $(document.body).find($(this.target).find(".next-track:not([disabled])")).click(function () {
            _this.next()
        })
        $(document.body).find($(this.target).find(".volume__state")).click(function () {
            _this.setVolume($(this).attr("class").split(/\s+/).includes("setVolumeZero") ? 0 : 1)
        })
        $(document.body).find($(this.target).find(".prev-track:not([disabled])")).click(function () {
            _this.prev()
        })
        $(document.body).find($(this.target).find(".seek_slider")).change(function () {
            _this.seekTo()
        })


        $(document.body).find($(this.target).find(".volume__lines")).bind('mousewheel', function (e) {
            e.preventDefault();
            if (e.originalEvent.wheelDelta / 120 > 0) {
                if (_this.getVolume() < 1)
                    _this.setVolume(_this.getVolume() + 1 * 20 / 100)
            } else {
                if (_this.getVolume() > 0)
                    _this.setVolume((_this.getVolume() - 1 * 20 / 100).toFixed(2));
            }
        });
    }
    getVolume() {
        return this.curr_track.volume
    }

    setVolume(volume) {
        this.curr_track.volume = volume;
        $(this.target).find(".volume__lines span")
            .removeClass("active")
            .parent().find(`span:lt(${parseFloat(volume) !== 1 ? parseFloat(volume).toFixed(1).toString().split(".").at(-1) : 10})`).addClass("active")
        switch (parseFloat(volume)) {
            case 0:
                $(this.target).find(".volume__state").removeClass("setVolumeZero").html('<i class="fa-solid fa-volume-xmark"></i>')
                break
            case 0.2:
                $(this.target).find(".volume__state").addClass("setVolumeZero").html('<i class="fa-solid fa-volume-off"></i>')
                break
            case 0.4:
                $(this.target).find(".volume__state").addClass("setVolumeZero").html('<i class="fa-solid fa-volume-low"></i>')
                break;
            case 0.6: case 0.8: case 1:
                $(this.target).find(".volume__state").addClass("setVolumeZero").html('<i class="fa-solid fa-volume-high"></i>')
                break;
        }

    }

    load() {
        this.resetValue()
        clearInterval(this.updateTimer);
        let activeTrack = this.list[this.track_index];
        this.curr_track.src = activeTrack.path;

        this.curr_track.load();
        $(this.target).find(".track-length").text(`${this.track_index + 1} / ${this.list.length}`)
        if (this.list.length === 1) {
            $(this.target).find(".prev-track").attr("disabled", true)
            $(this.target).find(".next-track").attr("disabled", true)

        }
        this.trackName.text(activeTrack.name)
        this.trackArtist.text(activeTrack.artist)
        this.curr_track.addEventListener("loadeddata", () => {
            this.totalDuration.text(this.getDurationTime())
            this.curr_track.addEventListener("ended", () => {
                this.next()
            })
        })

    }


    seekUpdate() {
        if (!isNaN(this.curr_track.duration)) {
            let seekPosition = this.curr_track.currentTime * (100 / this.curr_track.duration);
            this.seek_slider.val(seekPosition);
            this.currentTime.text(this.getCurrentTime())
            this.totalDuration.text(this.getDurationTime())

        }
    }

    getCurrentTime() {
        if (!isNaN(this.curr_track.duration)) {
            let currentMinutes = Math.floor(this.curr_track.currentTime / 60);
            let currentSeconds = Math.floor(this.curr_track.currentTime - currentMinutes * 60);
            if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
            if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
            return currentMinutes + ":" + currentSeconds
        }
        return "00:00"
    }
    getDurationTime() {
        if (!isNaN(this.curr_track.duration)) {
            let durationMinutes = Math.floor(this.curr_track.duration / 60);
            let durationSeconds = Math.floor(this.curr_track.duration - durationMinutes * 60);
            if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
            if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }
            return durationMinutes + ":" + durationSeconds
        }
        return "00:00"
    }
    next() {
        if (this.track_index < this.list.length - 1)
            this.track_index += 1;
        else
            this.track_index = 0;
        this.load();
    }
    seekTo() {
        let seekto = this.curr_track.duration * ($(this.seek_slider).val() / 100);
        this.curr_track.currentTime = seekto;
        this.currentTime.text(this.getCurrentTime())
    }
    play() {
        this.curr_track.play();
        this.seekUpdate()
        this.updateTimer = setInterval(() => this.seekUpdate(), 1000)
    }
    prev() {
        if (this.track_index > 0)
            this.track_index -= 1;
        else
            this.track_index = this.list.length - 1;
        this.load();
    }
    pause() {
        clearInterval(this.updateTimer);
        this.curr_track.pause();
    }

    resetValue() {
        this.currentTime.text("00:00")
        this.seek_slider.val(0)
        $(this.target).find(".playpause-track").addClass("play-track").html('<i class="fa-solid fa-play"></i>')

    }
}
