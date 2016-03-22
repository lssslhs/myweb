+function() {
	'use strict';

	var mongoose = require('mongoose')
	,	Schema = mongoose.Schema;

	var JobListSchema = new Schema({
		username: {
			type: String,
			unique: true,
			required: true
		},

		joblist: [{
			id: {
				type: Number,
				default: 0
			},

			jobid: {
				type: String,
				default: ''
			},

			companyname: {
				type: String,
				default: 'none'
			},

			location: {
				type: String,
				default: 'none'
			},

			jobtitle: {
				type: String,
				default: 'none'
			},

			applydate: {
				type: Date,
				default: Date.now
			},

			status: {
				type: Number,
				default: 0
			},

			interviewtime: {
				type: Date,
				default: Date.now
			}
		}]
	});

	JobListSchema.add({
		memo: {
			type: String,
			default: ''
	}});

	JobListSchema.virtual("jobInfo").get(function(){
		return this.joblist
	});

	mongoose.model('JobList', JobListSchema);  
}();