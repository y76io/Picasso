import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { CanvasWhiteboardOptions } from 'ng2-canvas-whiteboard';
import axios from 'axios';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private afu: AngularFireAuth,
    private router: Router
  ) {
    this.afu.authState.subscribe((auth: any) => {
      this.authState = auth;
      if (!this.authState) {
        this.router.navigate(['/login']);
      }
    });
  }
  authState = null;
  mode = 'text';
  advanced: any = false;
  min_images: number = 1;
  max_images: number = 4;
  samples: number = 1;
  min_steps: number = 1;
  max_steps: number = 500;
  steps: number = 50;
  min_scale: number = 1;
  max_scale: number = 20;
  scale: number = 7.5;
  min_seed: number = 1;
  max_seed: number = 2147483647;
  seed: number = Math.floor(Math.random() * this.max_seed);
  min_strength: number = 0;
  max_strength: number = 20;
  strength: number = 0.8;
  loading = false;
  prompt = '';
  init_image: any = '';
  images = [];
  inpaint_images: any = [];
  color = 'white';
  image_to_image_results = [];
  canvas_image = '';
  options: CanvasWhiteboardOptions = {
    drawingEnabled: true,
    drawButtonEnabled: true,
    drawButtonClass: 'drawButtonClass',
    drawButtonText: 'Draw',
    clearButtonEnabled: true,
    clearButtonClass: 'clearButtonClass',
    clearButtonText: 'Clear',
    undoButtonText: 'Undo',
    undoButtonEnabled: true,
    redoButtonText: 'Redo',
    redoButtonEnabled: true,
    redoButtonClass: 'redoButtonClass',
    colorPickerEnabled: true,
    fillColorPickerText: 'Fill',
    strokeColorPickerText: 'Stroke',
    saveDataButtonEnabled: true,
    saveDataButtonText: 'Save',
    lineWidth: 5,
    strokeColor: 'white',
    shouldDownloadDrawing: true,
    startingColor: 'transparent',
    strokeColorPickerEnabled: false,
  };

  strokeOn = false;
  midjourny = false;

  setStroke() {
    this.strokeOn = !this.strokeOn;
  }

  changeStrokeWidth(width: any) {
    this.options = {
      ...this.options,
      lineWidth: width,
    };
    this.strokeOn = false;
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onloadend = () => {
      var background = new Image();
      background.src = reader.result;
      var c: any = document.getElementsByClassName('canvas_whiteboard')[0];
      var ctx = c.getContext('2d');

      background.onload = function () {
        ctx.drawImage(background, 0, 0, c.width, c.height);
      };
    };
    reader.readAsDataURL(file);
  }

  canvasImageClick() {
    $('#canvas_image').click();
  }

  fillColor() {
    var canvas: any = document.getElementsByClassName('canvas_whiteboard')[0];
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = this.options.strokeColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  changeColor(event: any) {
    this.options = {
      ...this.options,
      strokeColor: event.target.value,
    };
  }

  setMode(mode: any) {
    this.mode = mode;
    this.canvas_image = '';
    this.options = {
      ...this.options,
      strokeColor: 'white',
      lineWidth: 5,
    };
  }

  minusImage() {
    if (this.samples - 1 >= this.min_images) {
      this.samples = this.samples - 1;
    }
  }

  plusImage() {
    if (this.samples + 1 <= this.max_images) {
      this.samples = this.samples + 1;
    }
  }

  minusSteps() {
    if (this.steps - 1 >= this.min_steps) {
      this.steps = this.steps - 1;
    }
  }

  plusSteps() {
    if (this.steps + 1 <= this.max_steps) {
      this.steps = this.steps + 1;
    }
  }

  minusSeed() {
    if (this.seed - 1 >= this.min_seed) {
      this.seed = this.seed - 1;
    }
  }

  plusSeed() {
    if (this.seed + 1 <= this.max_seed) {
      this.seed = this.seed + 1;
    }
  }

  minusScale() {
    if (this.scale - 0.01 >= this.min_scale) {
      this.scale = Number((this.scale - 0.01).toFixed(2));
    }
  }

  plusScale() {
    if (this.scale + 0.01 <= this.max_scale) {
      this.scale = Number((this.scale + 0.01).toFixed(2));
    }
  }

  minusStrength() {
    if (this.strength - 0.01 >= this.min_strength) {
      this.strength = Number((this.strength - 0.01).toFixed(2));
    }
  }

  plusStrength() {
    if (this.strength + 0.01 <= this.max_strength) {
      this.strength = Number((this.strength + 0.01).toFixed(2));
    }
  }
  changeSample(event: any) {
    if (event.target.value >= this.max_images) {
      event.preventDefault();
      this.samples = this.max_images;
    }
    if (event.target.value <= this.min_images) {
      event.preventDefault();
      this.samples = this.min_images;
    }
  }

  changeSteps(event: any) {
    if (event.target.value >= this.max_steps) {
      event.preventDefault();
      this.steps = this.max_steps;
    }
    if (event.target.value <= this.min_steps) {
      event.preventDefault();
      this.steps = this.min_steps;
    }
  }
  changeStrength(event: any) {
    if (event.target.value >= this.max_strength) {
      event.preventDefault();
      this.strength = this.max_strength;
    }
    if (event.target.value <= this.min_strength) {
      event.preventDefault();
      this.strength = this.min_strength;
    }
  }
  changeSeed(event: any) {
    if (event.target.value >= this.max_seed) {
      event.preventDefault();
      this.seed = this.max_seed;
    }
    if (event.target.value <= this.min_seed) {
      event.preventDefault();
      this.steps = this.min_seed;
    }
  }
  changeScale(event: any) {
    if (event.target.value >= this.max_scale) {
      event.preventDefault();
      this.scale = this.max_scale;
    }
    if (event.target.value <= this.min_scale) {
      event.preventDefault();
      this.scale = this.min_scale;
    }
  }

  toggleAdvanced() {
    this.advanced = !this.advanced;
    $('.advanced-div').slideToggle();
    $('.advanced .title i').toggleClass('rotate');
  }

  async textToImage() {
    this.loading = true;

    // try {
    //   const response = await axios.get('http://35.209.131.22:5000', {
    //     params: { prompt: this.prompt },
    //   });
    //   this.images = response.data;
    //   console.log(response.data);
    //   this.loading = false;
    // } catch (error) {
    //   console.log(error);
    //   this.loading = false;
    //   alert('Something went wrong!');
    // }

    let formData: FormData = new FormData();
    this.midjourny = this.prompt.includes('mdjrny-v4 style') ? true : true;
    const data = {
      prompt: this.prompt,
      samples: this.samples,
      steps: this.steps,
      scale: this.scale,
      seed: this.seed,
      strength: this.strength,
      midjourny: this.midjourny,
    };

    formData.append('init_image', this.init_image);
    formData.append('data', JSON.stringify(data));

    return await this.http
      .post('http://35.209.131.22:5000/api/', formData)
      .subscribe(
        async (data: any) => {
          this.images = await data;
          console.log(this.images);
        },
        (err) => {
          this.loading = false;
          alert('Something went wrong!');
        }
      );
  }

  download() {
    $('.canvas_whiteboard_button-save').click();
  }
  undo() {
    $('.canvas_whiteboard_button-undo').click();
  }

  redo() {
    $('.canvas_whiteboard_button-redo').click();
  }

  clear() {
    this.canvas_image = '';
    $('.canvas_whiteboard_button-clear').click();
  }
  async imageToImage() {
    this.spinner.show();
    this.image_to_image_results = [];

    let canvas = document.getElementsByClassName(
      'canvas_whiteboard'
    )[0] as HTMLCanvasElement;

    let mask_data_url = canvas.toDataURL();

    if (!this.prompt) {
      this.spinner.hide();

      alert('Please enter a prompt');
      return;
    }
    if (!mask_data_url) {
      this.spinner.hide();

      alert('Please choose a mask image');
      return;
    } else {
      await axios
        .post('http://35.209.131.22:5000/api/imgtoimg', {
          prompt: this.prompt,
          init_image: mask_data_url,
          steps: this.steps,
          seed: this.seed,
          scale: this.scale,
          strength: this.strength,
        })
        .then(async (response) => {
          this.image_to_image_results = await response.data;
          this.spinner.hide();
        })
        .catch((error) => {
          this.spinner.hide();
          alert('Something went wrong!');
        });
    }
  }

  uploadInpaintImage(event: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onloadend = () => {
      var background = new Image();
      this.canvas_image = reader.result;
      background.src = reader.result;
      var c: any = document.getElementsByClassName('canvas_whiteboard')[0];
      var ctx = c.getContext('2d');

      background.onload = function () {
        ctx.drawImage(background, 0, 0, c.width, c.height);
      };
    };
    reader.readAsDataURL(file);
  }

  inpaintUploadClick() {
    this.canvas_image = 'dd';
    $('#inpaint-image').click();
  }

  editClick() {
    var background = new Image();
    if (this.mode === 'image') {
      background.src =
        'data:image/jpeg;base64,' + this.image_to_image_results[0];
    } else {
      background.src = 'data:image/jpeg;base64,' + this.inpaint_images[0];
    }
    var c: any = document.getElementsByClassName('canvas_whiteboard')[0];
    var ctx = c.getContext('2d');

    background.onload = function () {
      ctx.drawImage(background, 0, 0, c.width, c.height);
    };
  }

  generateClick() {
    this.images = [];
    this.image_to_image_results = [];
    if (!this.prompt) {
      alert('Please enter a prompt !');
    } else {
      if (this.mode === 'text') {
        this.textToImage();
      } else if (this.mode === 'image') {
        this.imageToImage();
      } else if (this.mode === 'inpaint') {
        this.inpainting();
      }
    }
  }

  clickUpload() {
    $('#init-image').click();
  }

  imageUpload(event: any) {
    this.init_image = event.target.files[0];
  }

  async inpainting() {
    this.spinner.show();
    this.inpaint_images = [];

    let canvas = document.getElementsByClassName(
      'canvas_whiteboard'
    )[0] as HTMLCanvasElement;

    let mask_data_url = canvas.toDataURL();

    if (!this.prompt) {
      this.spinner.hide();

      alert('Please enter a prompt');
      return;
    }
    if (!mask_data_url) {
      this.spinner.hide();

      alert('Please choose a mask image');
      return;
    }
    if (!this.canvas_image) {
      this.spinner.hide();

      alert('Please choose an init image');
      return;
    } else {
      await axios
        .post('http://35.209.131.22:5000/api/inpainting/', {
          prompt: this.prompt,
          mask: mask_data_url,
          init_image: this.canvas_image,
        })
        .then(async (response) => {
          this.inpaint_images = await response.data;
          console.log(this.inpaint_images);
          this.spinner.hide();
        })
        .catch((error) => {
          this.spinner.hide();

          alert('Something went wrong!');
        });
    }
  }

  ngOnInit(): void {}
}
