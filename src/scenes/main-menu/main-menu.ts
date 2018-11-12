import * as ex from 'excalibur';
import { Logo } from '../../actors';

const simpleButtonFactory = (message: string) => {
    let myButton = document.createElement('button');
    myButton.textContent = message; // 'The best button';
    return myButton;
};

class Button extends ex.UIActor {
    rootElement: HTMLElement
    buttonElement: HTMLElement
    // onClick: Function
    // _engine: ex.Engine

    constructor(message, x, y, onClick, factory = simpleButtonFactory) {
        super();
        this.rootElement = document.createElement('div');
        this.rootElement.style.position = 'absolute';
        document.body.appendChild(this.rootElement)
        this.buttonElement = factory(message);
        this.rootElement.appendChild(
            this.buttonElement
        );
        this.buttonElement.addEventListener('click', onClick);
        // this.onClick = onClick;
    }

    hide = () => this.rootElement.style.display = 'none';

    draw(ctx: CanvasRenderingContext2D) {
      let canvasHeight = this._engine.canvasHeight / window.devicePixelRatio;
      let canvasWidth = this._engine.canvasWidth / window.devicePixelRatio;
      let left = ctx.canvas.offsetLeft;
      let top = ctx.canvas.offsetTop;
      let buttonWidth = this.buttonElement.clientWidth;
      let buttonHeight = this.buttonElement.clientHeight;
      this.rootElement.style.left = `${left + canvasWidth / 2 - buttonWidth / 2}px`;
      this.rootElement.style.top = `${top + canvasHeight / 2 - buttonHeight / 2 + 100}px`;
    }
}

export class MainMenu extends ex.Scene {
    public onInitialize(engine: ex.Engine) {
        const logo = new Logo(
            engine.drawWidth / 2,
            400,
            'Isle'
        );
        this.add(logo);

        engine.addTimer(
            new ex.Timer(
                logo.strobe,
                20,
                true
            )
        )
                
        const playMe = new Button(
            'start game',
            engine.drawWidth / 2,
            400,
            () => {
                playMe.hide()
                engine.goToScene('wander');
            }
        ); 
        // new ex.Label(
        //     'start game',
        //     engine.drawWidth / 2,
        //     400,
        //     'Arial'
        // )
        // engine.input.pointers.primary.on('mousedown', () => {
        //     console.log("CLICK")
        //   engine.goToScene('wander')
        // });

        this.add(playMe);
    }
}