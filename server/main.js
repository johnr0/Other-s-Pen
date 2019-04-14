import { Meteor } from 'meteor/meteor';
import {Arguments, ArgumentEstimations, Feedback} from '../imports/collections/data'

Meteor.startup(() => {
  // code to run on server at startup
  // writer's subscription
  Meteor.publish('writer_publish_argument', function(argumentId){
    return Arguments.find({userId:this.userId, _id:argumentId});
  })

  Meteor.publish('writer_publish_estimation', function(argumentId){//
    return ArgumentEstimations.find({userId:this.userId, textId:argumentId, last:true})
  }) 

  // main page's subscription
  Meteor.publish('published_arguments', function(){//
    return Arguments.find({userId: {$ne: this.userId}, published:true}, {limit:10})
  }) 


  Meteor.publish('own_arguments', function(){//
    //console.log(Arguments.find({}).limit(10))
    return Arguments.find({userId: this.userId})
  }) 

  // reader's subscription
  Meteor.publish('reader_publish_argument', function(argumentId){
    return Arguments.find({_id:argumentId});
  })

  Meteor.publish('reader_publish_comment', function(argumentId){
    //console.log(Feedback.find().fetch(), argumentId)
    
    return Feedback.find({textId: argumentId, resolved: false,});
  })

  Meteor.publish('feedback_for_argument', function(argumentId){
    console.log(Feedback.find().fetch(), argumentId)
    
    return Feedback.find({textId: argumentId, resolved: false,});
  })


  Meteor.publish('feedbackonfeedback_publish', function(){
    return Feedback.find({userId:this.userId, resolved:true, resolved2:false,})
  })

  Meteor.publish('feedbackonfeedback_reflection', function(feedbackid){
    return Feedback.find({userId:this.userId, _id:feedbackid})
  })
});
