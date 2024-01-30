const Screenmanager ={

    _DOM: {
        // Home Buttons
        musicButton: undefined,

        // Animations
        sparkleAnimation: undefined,
        notes: undefined,
    },

    initialize: function(){
        const DOM = this._DOM;

        DOM.musicButton = document.getElementById('musicbtn');
        DOM.sparkleAnimation = document.getElementsByClassName('sparkle-animation');
        DOM.notes = document.getElementById('notes');

       // Events
      DOM.musicButton.addEventListener('mouseover' , () => this.musicOver());
      DOM.musicButton.addEventListener('mouseout' , () => this.musicOut());

    },

    // music Button animations
    musicOver: function(){
        this._DOM.notes.style.visibility = 'visible';
        for(let i = 0; i < this._DOM.sparkleAnimation.length; i++){
            this._DOM.sparkleAnimation[i].style.animationPlayState = 'initial';
        }
    },
    musicOut: function(){
        this._DOM.notes.style.visibility = 'hidden';
        for(let i = 0; i < this._DOM.sparkleAnimation.length; i++){
            this._DOM.sparkleAnimation[i].style.animationPlayState = 'paused';
        }
    },

}

document.addEventListener('DOMContentLoaded', () => {

    // initialization tasks
    Screenmanager.initialize();
});