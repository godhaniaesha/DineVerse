import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUsers, FiMapPin, FiPhone, FiCheckCircle, FiXCircle, FiEdit, FiTrash2 } from 'react-icons/fi';
import { IoRestaurantOutline, IoWineOutline, IoCafeOutline } from 'react-icons/io5';
import { useTableReservation } from '../contexts/TableReservationContext';
import '../style/h_style.css';

const STATUS_COLORS = {
  'Confirmed': '#10b981',
  'Arrived': '#f59e0b',
  'Completed': '#6c757d',
  'Cancelled': '#dc3545',
  'Pending': '#ffc107'
};

const STATUS_ICONS = {
  'Confirmed': <FiCheckCircle />,
  'Arrived': <FiUsers />,
  'Completed': <FiCheckCircle />,
  'Cancelled': <FiXCircle />,
  'Pending': <FiClock />
};

const AREA_ICONS = {
  'Restaurant': <IoRestaurantOutline />,
  'Bar': <IoWineOutline />,
  'Cafe': <IoCafeOutline />
};

export default function TableReservation() {
  const { 
    reservations, 
    loading, 
    error, 
    getReservations, 
    cancelReservation, 
    updateReservationStatus,
    getUpcomingReservations,
    getPastReservations 
  } = useTableReservation();

  const [filter, setFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    getReservations();
  }, []);

  const upcomingReservations = getUpcomingReservations();
  const pastReservations = getPastReservations();
  const filteredReservations = filter === 'upcoming' ? upcomingReservations : 
                                   filter === 'past' ? pastReservations : 
                                   reservations;

  const handleCancel = async (reservationId) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      const result = await cancelReservation(reservationId);
      if (result.success) {
        alert('Reservation cancelled successfully');
      } else {
        alert(result.error || 'Failed to cancel reservation');
      }
    }
  };

  const handleStatusUpdate = async (reservationId, newStatus) => {
    const result = await updateReservationStatus(reservationId, newStatus);
    if (result.success) {
      alert(`Reservation status updated to ${newStatus}`);
    } else {
      alert(result.error || 'Failed to update status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading reservations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="table-reservation-container">
      <div className="reservation-header">
        <h2>My Table Reservations</h2>
        <div className="filter-tabs">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({reservations.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming ({upcomingReservations.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Past ({pastReservations.length})
          </button>
        </div>
      </div>

      {filteredReservations.length === 0 ? (
        <div className="no-reservations">
          <FiCalendar />
          <h3>No {filter === 'upcoming' ? 'upcoming' : filter === 'past' ? 'past' : ''} reservations</h3>
          <p>
            {filter === 'upcoming' 
              ? "You don't have any upcoming table reservations. Book a table to see it here!"
              : filter === 'past'
              ? "You haven't made any table reservations yet."
              : "You haven't made any table reservations yet."
            }
          </p>
          <button 
            className="book-table-btn"
            onClick={() => window.location.href = '/book-table'}
          >
            Book a Table
          </button>
        </div>
      ) : (
        <div className="reservations-grid">
          {filteredReservations.map((reservation) => (
            <div key={reservation._id} className="reservation-card">
              <div className="reservation-header">
                <div className="reservation-info">
                  <h3>{reservation.guest_name}</h3>
                  <div className="reservation-meta">
                    <span className="area-badge" style={{ 
                      backgroundColor: reservation.area === 'Restaurant' ? '#c8965a' : 
                                       reservation.area === 'Bar' ? '#9b8fd4' : '#7ab898',
                      color: 'white'
                    }}>
                      {AREA_ICONS[reservation.area] || <IoRestaurantOutline />}
                      {reservation.area}
                    </span>
                    <span className="date-time">
                      <FiCalendar /> {formatDate(reservation.date)}
                    </span>
                    <span className="date-time">
                      <FiClock /> {reservation.time}
                    </span>
                  </div>
                </div>
                <div className="reservation-status">
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: STATUS_COLORS[reservation.status] || '#6c757d',
                      color: 'white'
                    }}
                  >
                    {STATUS_ICONS[reservation.status] || <FiCheckCircle />}
                    {reservation.status}
                  </span>
                </div>
              </div>

              <div className="reservation-details">
                <div className="detail-row">
                  <span className="detail-label">Table:</span>
                  <span className="detail-value">{reservation.table?.tableNo || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Guests:</span>
                  <span className="detail-value">{reservation.guests}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{reservation.phone}</span>
                </div>
                {reservation.occasion && (
                  <div className="detail-row">
                    <span className="detail-label">Occasion:</span>
                    <span className="detail-value">{reservation.occasion}</span>
                  </div>
                )}
                {reservation.specialRequest && (
                  <div className="detail-row">
                    <span className="detail-label">Special Request:</span>
                    <span className="detail-value">{reservation.specialRequest}</span>
                  </div>
                )}
              </div>

              <div className="reservation-actions">
                {reservation.status === 'Confirmed' && (
                  <button 
                    className="action-btn confirm-btn"
                    onClick={() => handleStatusUpdate(reservation._id, 'Arrived')}
                  >
                    <FiCheckCircle /> Mark Arrived
                  </button>
                )}
                {reservation.status === 'Arrived' && (
                  <button 
                    className="action-btn complete-btn"
                    onClick={() => handleStatusUpdate(reservation._id, 'Completed')}
                  >
                    <FiCheckCircle /> Mark Completed
                  </button>
                )}
                {reservation.status !== 'Cancelled' && reservation.status !== 'Completed' && (
                  <button 
                    className="action-btn cancel-btn"
                    onClick={() => handleCancel(reservation._id)}
                  >
                    <FiTrash2 /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
