import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TopicsService } from './topics.service';
import { TopicsComponent } from './topics.component';
import { TopicsStartComponent } from './topics-start/topics-start.component';
import { TopicListComponent } from './topic-list/topic-list.component';
import { TopicItemComponent } from './topic-list/topic-item/topic-item.component';
import { TopicDetailComponent } from './topic-detail/topic-detail.component';
import { TopicEditComponent } from './topic-edit/topic-edit.component';
import { TopicsRoutingModule } from './topics-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        TopicsComponent,
        TopicsStartComponent,
        TopicListComponent,
        TopicItemComponent,
        TopicDetailComponent,
        TopicEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TopicsRoutingModule,
        SharedModule
    ],
    exports: [TopicListComponent],
    providers: [
        TopicsService
    ]
})
export class TopicsModule {}
