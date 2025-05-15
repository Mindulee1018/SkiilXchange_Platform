import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FaCheckCircle, FaStar } from 'react-icons/fa';
import Navbar from '../../components/common/navbar';

const ProgressTimeline = ({ updates }) => {
  return (
    <>
      <div className="fixed-top bg-white shadow-sm">
        <Navbar />
      </div>

      <div style={{ marginTop: '80px' }}> {/* Offset to avoid overlap with fixed navbar */}
        <VerticalTimeline>
          {updates.map((update, index) => (
            <VerticalTimelineElement
              key={index}
              date={new Date(update.date).toLocaleDateString()}
              iconStyle={{ background: '#0d6efd', color: '#fff' }}
              icon={<FaCheckCircle />}
            >
              <h4 className="vertical-timeline-element-title">{update.topic}</h4>
              <h6 className="text-muted">{update.skill}</h6>
              <p>{update.description}</p>
              {update.completed && (
                <div className="badge bg-success">
                  <FaStar className="me-1" /> Completed
                </div>
              )}
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default ProgressTimeline;
