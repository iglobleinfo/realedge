import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from "./shared/ui/loader/loader.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [LoaderComponent,RouterOutlet, LoaderComponent],
})
export class AppComponent implements OnInit {

  ngOnInit() {
  }
}
