class Assessment::CodingQuestion < ActiveRecord::Base
  is_a :question, as: 'as_assessment_question'

  has_one :depends_on, foreign_key: 'depends_on', class_name: 'Assessment::CodingQuestion'
end