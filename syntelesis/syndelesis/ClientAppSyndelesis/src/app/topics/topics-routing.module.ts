import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from '../auth/auth-guard.service';
import { TopicsComponent } from './topics.component';
import { TopicsStartComponent } from './topics-start/topics-start.component';
// import { TopicEditComponent } from './topic-edit/topic-edit.component';
import { TopicDetailComponent } from './topic-detail/topic-detail.component';

const topicsRoutes: Routes = [
    {
     path: 'topics', component: TopicsComponent, canActivate: [AuthGuardService], children: [
        {path: '', component: TopicsStartComponent},
        // {path: 'new', component: TopicEditComponent, canActivate: [AuthGuardService]},
        {path: ':id', component: TopicDetailComponent},
        // {path: ':id/edit', component: TopicEditComponent, canActivate: [AuthGuardService]},
      ] }
];


@NgModule({
    imports: [RouterModule.forChild(topicsRoutes)],
    exports: [RouterModule],
    providers: [
    ]
})
export class TopicsRoutingModule {}
