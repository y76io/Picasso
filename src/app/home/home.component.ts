import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private http: HttpClient) {}
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

  setMode(mode: any) {
    this.mode = mode;
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

  async getUserData() {
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
    const data = {
      prompt: this.prompt,
      samples: this.samples,
      steps: this.steps,
      scale: this.scale,
      seed: this.seed,
      strength: this.strength,
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

  generateClick() {
    this.images = [];
    if (!this.prompt) {
      alert('Please enter a prompt !');
    } else {
      if (this.mode === 'text') {
        this.getUserData();
      }
    }
  }

  clickUpload() {
    $('#init-image').click();
  }

  imageUpload(event: any) {
    this.init_image = event.target.files[0];
  }

  ngOnInit(): void {}
}
