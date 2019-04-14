import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Switch, BrowserRouter } from 'react-router-dom'

import WrapPage from './components/wrap_page'
import WritePage from './components/write/write_page'
import ReadPage from './components/read/read_page'
import FeedbackOnFeedback from './components/feedback_on_feedback/feedback_on_feedback'

const routes = (
  <BrowserRouter>
    <div>
      <Switch>
        <Route path="/write/:textid" component={WritePage} />
        <Route path="/read/:textid" component={ReadPage}/>
        <Route path="/feedbackonfeedback/:feedbackid" component={FeedbackOnFeedback}/>
        <Route path="/" component={WrapPage} />
        
      </Switch>
    </div>
  </BrowserRouter>
)

//this function renders components in the class task_page
Meteor.startup(()=>{
  ReactDOM.render(routes, document.querySelector('.body'));
})
