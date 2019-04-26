import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

Meteor.methods({
    'arguments.newargument': function(){
        // annotate below line later
        //Arguments.remove({})
        //ArgumentEstimations.remove({})
        console.log(this.userId)
        var users = Meteor.users.find(this.userId).fetch()
        console.log(users)
        return Arguments.insert({
            userId: this.userId,
            email: users[0]['emails'][0]['address'],
            generateDate: new Date(),
            lastSave: new Date(),
            topic: '',
            argument: 'Start new argument',
            published: false,
            prediction: false,        
        }, function(err, res){
            return 
        })
    },

    'arguments.updatetext': function(textid, text){
        Arguments.update(textid, { $set : {argument: text, lastSave: new Date()}})
    },

    'arguments.settopic': function(textid, topic){
        Arguments.update(textid, { $set : {topic: topic}})
    },

    'arguments.updatepublish': function(textid){
        var pub = Arguments.findOne(textid)['published']
        //console.log(pub)
        Arguments.update(textid, { $set : {published: !pub}})
    },

    'arguments.beginprediction': function(textid){
        Arguments.update(textid, { $set : {prediction: true}})
    },

    'arguments.endprediction': function(textid){
        Arguments.update(textid, { $set : {prediction: false}})
    },

    'arguments.get_user_email': function(userId){
        return Meteor.users.findOne(userId);
    },

    'argumentestimations.updateestimation': function(textid, estimations){
        // make the latest feedback invalid
        ArgumentEstimations.update({userId: this.userId, textId:textid}, {$set:{last:false}}, {multi: true})

        // input new feedback
        for(var i in estimations){
            console.log(estimations[i])
            ArgumentEstimations.insert({
                userId: this.userId,
                textId: textid,
                generateDate: new Date(),
                last: true,
                estimation: estimations[i],
            })
        }

    },

    'feedback.updatefeedback': function(textid, feedback, ontextposition, ontext, estimation, original_text){
        var writerId = Arguments.findOne({_id: textid}).userId
        //Feedback.remove({})
        var users = Meteor.users.find(this.userId).fetch()
        var writers = Meteor.users.find(writerId).fetch()
        Feedback.insert({
            userId: this.userId,
            useremail: users[0]['emails'][0]['address'],
            textId: textid,
            writerId: writerId,
            writeremail: writers[0]['emails'][0]['address'],
            texthistory:original_text,
            generateDate: new Date(),
            comment: feedback, 
            estimation:estimation,
            ontextposition: ontextposition,
            ontext: ontext,
            resolved: false,
            resolved2: false,
            // reflection from the writer about this feedback
            writer_reflection:'',
            // feedback on feedback from the writer
            feedback_on_feedback:'',
            // feedback giver's reflection on the feedback on feedback
            feedback_reflection:'',
        })
    },
    
    'feedback.updatereflection': function(feedbackid, reflection, fonf, ){
        console.log(feedbackid, reflection, fonf)
        Feedback.update(feedbackid, { $set : {writer_reflection:reflection, feedback_on_feedback:fonf, resolved:true}})
    },

    'feedback.FonFReflection': function(feedbackid, reflection){
        Feedback.update(feedbackid, {$set: {resolved2:true, feedback_reflection:reflection}})
    },

})

export const Arguments = new Mongo.Collection('arguments');
export const ArgumentEstimations = new Mongo.Collection('argumentestimations')
export const Feedback = new Mongo.Collection('feedback');
export const FeedbackEstimations = new Mongo.Collection('feedbackestimations')