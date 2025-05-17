import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FaCheckCircle, FaStar } from 'react-icons/fa';

const ProgressTimeline = ({ updates }) => {
  return (
    <VerticalTimeline>
      {updates.map((update, index) => (
        <VerticalTimelineElement
          key={index}
          date={new Date(update.date || update.timestamp).toLocaleDateString()}
          iconStyle={{ background: '#0d6efd', color: '#fff' }}
          icon={<FaCheckCircle />}
        >
          <h4 className="vertical-timeline-element-title">{update.topic || update.type}</h4>
          <h6 className="text-muted">{update.skill || ''}</h6>
          <p>{update.description || update.message}</p>
          {update.completed && (
            <div className="badge bg-success">
              <FaStar className="me-1" /> Completed
            </div>
          )}
        </VerticalTimelineElement>
      ))}
    </VerticalTimeline>
  );
};

export default ProgressTimeline;
