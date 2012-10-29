class Assignment < ActiveRecord::Base
  attr_accessible :attempt_limit, :auto_graded, :class_id, :close_at, :creator_id, :deadline, :description, :exp, :open_at, :order, :timelimit

  belongs_to :course
  belongs_to :creator, class_name: "User"

  has_many :mcqs
  has_many :written_questions

end