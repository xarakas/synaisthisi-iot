import { Component, OnInit, Input} from '@angular/core';

import { Topic } from '../../../shared/topic.model';

@Component({
  selector: 'app-topic-item',
  templateUrl: './topic-item.component.html',
  styleUrls: ['./topic-item.component.css']
})
export class TopicItemComponent implements OnInit {
  @Input() topic: Topic;

  constructor() { }

  ngOnInit() {
  }

}
