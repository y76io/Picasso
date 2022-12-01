import { Component, Input, OnInit } from '@angular/core';
import * as $ from 'jquery';

import {
  CanvasWhiteboardComponent,
  CanvasWhiteboardOptions,
} from 'ng2-canvas-whiteboard';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
  viewProviders: [CanvasWhiteboardComponent],
})
export class CanvasComponent implements OnInit {
  constructor() {}

  @Input() canvasOptions: CanvasWhiteboardOptions = {};

  ngOnInit(): void {}
}
