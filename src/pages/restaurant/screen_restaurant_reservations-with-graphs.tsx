import { useOwner } from "@/context/ownerContext";
import { useEffect, useRef, useState } from "react";
import type { ConnectDragSource, ConnectDropTarget } from "react-dnd";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface ReservationItem {
  id: number;
  customerName: string;
  tableNo: string;
  guestNo: number;
  cellNumber: string;
  email: string;
  reservationTime: string;
  customRequest: string;
}

interface DragItem extends ReservationItem {
  isOnCanvas: boolean;
  position: { x: number; y: number };
}

interface DraggableReservationProps {
  reservation: ReservationItem;
  isOnCanvas?: boolean;
  position?: { x: number; y: number };
  isHighlighted?: boolean;
  onClick?: () => void;
}

const DraggableReservation = ({ 
  reservation, 
  isOnCanvas = false, 
  position = { x: 0, y: 0 },
  isHighlighted = false,
  onClick
}: DraggableReservationProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'reservation',
    item: { ...reservation, isOnCanvas, position } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Connect the drag source to the ref
  drag(ref);

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'hold': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  if (isOnCanvas) {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`absolute cursor-move p-3 bg-white rounded-lg shadow-md border-2 transition-all ${
          isDragging ? 'opacity-50' : 'opacity-100'
        } ${
          isHighlighted ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' : 'border-gray-200'
        } min-w-[120px] max-w-[150px] hover:shadow-lg`}
        style={{ 
          left: position.x, 
          top: position.y,
          transform: isDragging ? 'rotate(5deg)' : 'none'
        }}
      >
        <div className={`w-3 h-3 rounded-full ${getStatusColor(reservation.customRequest)} mb-2`}></div>
        <div className="text-sm font-semibold text-gray-800 truncate">
          {reservation.customerName}
        </div>
        <div className="text-xs text-gray-600">
          Table {reservation.tableNo}
        </div>
        <div className="text-xs text-gray-600">
          {reservation.guestNo} guests
        </div>
        <div className="text-xs text-gray-500">
          {formatTime(reservation.reservationTime)}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`cursor-move p-4 bg-white rounded-lg shadow-sm border mb-3 hover:shadow-md transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${
        isHighlighted ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${getStatusColor(reservation.customRequest)}`}></div>
          <div>
            <div className="font-semibold text-gray-800">{reservation.customerName}</div>
            <div className="text-sm text-gray-600">
              Table {reservation.tableNo} • {reservation.guestNo} guests
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-800">
            {formatTime(reservation.reservationTime)}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {reservation.customRequest}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CanvasProps {
  onDrop: (item: DragItem, x: number, y: number) => void;
  canvasReservations: Array<ReservationItem & { position: { x: number; y: number } }>;
  selectedReservationId: number | null;
  onReservationClick: (id: number) => void;
}

const Canvas = ({ onDrop, canvasReservations, selectedReservationId, onReservationClick }: CanvasProps) => {
  const dropRef = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'reservation',
    drop: (item: DragItem, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = dropRef.current?.getBoundingClientRect();
      if (offset && canvasRect) {
        const x = offset.x - canvasRect.left;
        const y = offset.y - canvasRect.top;
        onDrop(item, x, y);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Connect the drop target to the ref
  drop(dropRef);

  return (
    <div
      id="canvas"
      ref={dropRef}
      className={`relative w-full h-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden ${
        isOver ? 'border-blue-400 bg-blue-50' : ''
      }`}
      style={{ minHeight: '600px' }}
    >
      <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
        <div className="text-center">
          <div className="text-lg font-medium">Restaurant Floor Plan</div>
          <div className="text-sm">Drag reservations to arrange them on the floor plan</div>
        </div>
      </div>
      
      {canvasReservations.map((reservation) => (
        <DraggableReservation
          key={`canvas-${reservation.id}`}
          reservation={reservation}
          isOnCanvas={true}
          position={reservation.position}
          isHighlighted={selectedReservationId === reservation.id}
          onClick={() => onReservationClick(reservation.id)}
        />
      ))}
    </div>
  );
};

export const RestaurantReservationsWithGraphs = () => {
  const {
    reservations,
    reservationsSearchQuery,
    fetchReservations,
    setReservationsSearchQuery,
  } = useOwner();

  const [canvasReservations, setCanvasReservations] = useState<
    Array<ReservationItem & { position: { x: number; y: number } }>
  >([]);
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);

  // Load reservations on component mount
  useEffect(() => {
    fetchReservations(1, reservationsSearchQuery);
  }, [reservationsSearchQuery, fetchReservations]);

  // Initialize canvas reservations when reservations are loaded
  useEffect(() => {
    if (reservations.length > 0 && canvasReservations.length === 0) {
      const initialCanvasReservations = reservations.map((reservation, index) => ({
        ...reservation,
        position: {
          x: 100 + (index % 4) * 180, // Arrange in a grid
          y: 100 + Math.floor(index / 4) * 120
        }
      }));
      setCanvasReservations(initialCanvasReservations);
    }
  }, [reservations, canvasReservations.length]);

  const handleDrop = (item: DragItem, x: number, y: number) => {
    // Always moving within canvas since all items are on canvas
    setCanvasReservations(prev =>
      prev.map(res =>
        res.id === item.id
          ? { ...res, position: { x: Math.max(0, x - 60), y: Math.max(0, y - 40) } }
          : res
      )
    );
  };

  const handleReservationClick = (id: number) => {
    setSelectedReservationId(selectedReservationId === id ? null : id);
  };

  // All reservations are available in the list
  const availableReservations = reservations;

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const groupReservationsByTime = (reservations: ReservationItem[]) => {
    const groups: { [key: string]: ReservationItem[] } = {};
    
    reservations.forEach(reservation => {
      const date = new Date(reservation.reservationTime);
      const timeKey = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'} / ${formatDate(reservation.reservationTime)}`;
      
      if (!groups[timeKey]) {
        groups[timeKey] = [];
      }
      groups[timeKey].push(reservation);
    });
    
    return groups;
  };

  const groupedReservations = groupReservationsByTime(availableReservations);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-100">
        {/* Left side - Canvas */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm h-full p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Floor Plan</h2>
              <div className="text-sm text-gray-600">
                {canvasReservations.length} reservations placed
              </div>
            </div>
            <Canvas 
              onDrop={handleDrop} 
              canvasReservations={canvasReservations}
              selectedReservationId={selectedReservationId}
              onReservationClick={handleReservationClick}
            />
          </div>
        </div>

        {/* Right side - Reservations List */}
        <div className="w-96 bg-white shadow-lg p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Reservations ({availableReservations.length})
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>33</span>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search reservations..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={reservationsSearchQuery}
              onChange={(e) => setReservationsSearchQuery(e.target.value)}
            />
          </div>

          {/* Reservations grouped by time */}
          <div className="space-y-4">
            {Object.entries(groupedReservations).map(([timeSlot, reservations]) => (
              <div key={timeSlot}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">{timeSlot}</h3>
                  <div className="flex items-center space-x-1">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                      {reservations.length}
                    </span>
                    <span className="text-xs text-gray-500">👥 {reservations.reduce((sum, r) => sum + r.guestNo, 0)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {reservations.map((reservation) => (
                    <DraggableReservation
                      key={reservation.id}
                      reservation={reservation}
                      isHighlighted={selectedReservationId === reservation.id}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {availableReservations.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <div className="text-lg">📅</div>
              <div className="mt-2">No reservations found</div>
              <div className="text-sm">Try adjusting your search criteria</div>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};
