// src/OrderPipeline.jsx
import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { v4 as uuidv4 } from 'uuid';

const statuses = [
  'Consultation',
  'Fabric Selected',
  'In Production',
  'First Fitting',
  'Final Fitting',
  'Ready',
  'Picked Up',
];

const OrderPipeline = ({ crmData, updateCrmData }) => {
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeStatus = statuses.find((status) =>
      crmData.orders.some((o) => o.order_id === activeId && o.status === status)
    );
    const overStatus = statuses.find((status) =>
      crmData.orders.some((o) => o.order_id === overId && o.status === status)
    ) || over.id; // For dropping into empty column

    if (activeStatus === overStatus) {
      // Reorder within same status
      const ordersInStatus = crmData.orders.filter((o) => o.status === activeStatus);
      const oldIndex = ordersInStatus.findIndex((o) => o.order_id === activeId);
      const newIndex = ordersInStatus.findIndex((o) => o.order_id === overId);

      if (oldIndex === newIndex) return;

      const newOrdersInStatus = arrayMove(ordersInStatus, oldIndex, newIndex);
      const updatedOrders = crmData.orders.map((o) =>
        o.status !== activeStatus ? o : newOrdersInStatus[ordersInStatus.indexOf(o)]
      );

      updateCrmData({ ...crmData, orders: updatedOrders });
    } else {
      // Move to new status
      const order = crmData.orders.find((o) => o.order_id === activeId);
      if (!order) return;

      let notification = '';
      if (overStatus === 'First Fitting') {
        notification = 'Client notified: First fitting scheduled.';
      } else if (overStatus === 'Ready') {
        notification = 'Client notified: Garment ready for pickup!';
      }

      const updatedOrder = { ...order, status: overStatus };
      const updatedOrders = crmData.orders.map((o) =>
        o.order_id === activeId ? updatedOrder : o
      );

      updateCrmData({ ...crmData, orders: updatedOrders });

      if (notification) alert(notification);
    }
  };

  const cloneOrder = (order) => {
    const cloned = {
      ...order,
      order_id: uuidv4(),
      status: 'Consultation',
      deposit_paid: 0,
      balance_due: order.total_price,
      photos: [],
      due_date: new Date().toISOString().split('T')[0],
    };
    updateCrmData({ ...crmData, orders: [...crmData.orders, cloned] });
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={onDragEnd}
    >
      <div style={{ display: 'flex', overflowX: 'auto', gap: '20px', padding: '20px 0' }}>
        {statuses.map((status) => {
          const ordersInStatus = crmData.orders.filter((o) => o.status === status);

          return (
            <div
              key={status}
              style={{
                minWidth: '320px',
                background: '#f8f9fa',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >
              <h3 style={{ margin: '0 0 16px 0', color: '#e91e63' }}>
                {status} ({ordersInStatus.length})
              </h3>

              <SortableContext
                id={status}
                items={ordersInStatus.map((o) => o.order_id)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  style={{
                    minHeight: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {ordersInStatus.map((order) => (
                    <SortableItem
                      key={order.order_id}
                      order={order}
                      crmData={crmData}
                      cloneOrder={cloneOrder}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
};

const SortableItem = ({ order, crmData, cloneOrder }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: order.order_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
    background: isDragging ? '#fff8fb' : 'white',
    border: isDragging ? '2px dashed #e91e63' : '1px solid #eee',
    padding: '16px',
  };

  const client = crmData.clients.find((c) => c.client_id === order.client_id);
  const fabric = crmData.fabrics?.find((f) => f.fabric_id === order.fabric_id);

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="card">
      <strong>
        {client?.first_name} {client?.last_name}
      </strong>
      <br />
      <small style={{ color: '#666' }}>{order.order_type}</small>
      {fabric && (
        <>
          <br />
          <small>Fabric: {fabric.name}</small>
        </>
      )}
      <div style={{ marginTop: '8px', fontWeight: 'bold' }}>
        ${order.total_price}
        {order.balance_due > 0 && (
          <span style={{ color: '#e91e63' }}> (Balance: ${order.balance_due})</span>
        )}
      </div>
      {order.photos?.[0] && (
        <img
          src={order.photos[0]}
          alt="Garment"
          style={{
            width: '100%',
            height: '120px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginTop: '8px',
          }}
        />
      )}
      <button
        onClick={() => cloneOrder(order)}
        style={{
          marginTop: '8px',
          fontSize: '12px',
          padding: '6px 10px',
          background: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Repeat Order
      </button>
    </div>
  );
};

export default OrderPipeline;


// import React from 'react';
// import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'; // npm install react-beautiful-dnd

// const statuses = ['Consultation', 'Fabric Selected', 'In Production', 'First Fitting', 'Final Fitting', 'Ready', 'Picked Up'];

// const OrderPipeline = ({ crmData, updateCrmData }) => {
//   const onDragEnd = (result) => {
//     if (!result.destination) return;
//     const { source, destination, draggableId } = result;
//     if (source.droppableId === destination.droppableId && source.index === destination.index) return;

//     const order = crmData.orders.find(o => o.order_id === draggableId);
//     const newStatus = destination.droppableId;
//     const updatedOrder = { ...order, status: newStatus };

//     let notification = '';
//     if (newStatus === 'First Fitting') notification = 'Client notified: First fitting scheduled.';
//     if (newStatus === 'Ready') notification = 'Client notified: Garment ready for pickup!';

//     const newOrders = crmData.orders.map(o => o.order_id === draggableId ? updatedOrder : o);
//     updateCrmData({ ...crmData, orders: newOrders });

//     if (notification) alert(notification);
//   };

//   const cloneOrder = (order) => {
//     const cloned = { ...order, order_id: uuidv4(), status: 'Consultation', deposit_paid: 0, photos: [] };
//     updateCrmData({ ...crmData, orders: [...crmData.orders, cloned] });
//   };

//   return (
//     <DragDropContext onDragEnd={onDragEnd}>
//       <div style={{ display: 'flex', overflowX: 'auto', gap: '20px' }}>
//         {statuses.map(status => (
//           <div key={status} style={{ minWidth: '300px', background: '#f0f0f0', padding: '10px', borderRadius: '8px' }}>
//             <h3>{status} ({crmData.orders.filter(o => o.status === status).length})</h3>
//             <Droppable droppableId={status}>
//               {(provided) => (
//                 <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: '200px' }}>
//                   {crmData.orders.filter(o => o.status === status).map((order, index) => {
//                     const client = crmData.clients.find(c => c.client_id === order.client_id);
//                     const fabric = crmData.fabrics.find(f => f.fabric_id === order.fabric_id);
//                     return (
//                       <Draggable key={order.order_id} draggableId={order.order_id} index={index}>
//                         {(provided) => (
//                           <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="card" style={{ margin: '10px 0', padding: '15px' }}>
//                             <strong>{client?.first_name} {client?.last_name}</strong><br/>
//                             {order.order_type}<br/>
//                             {fabric?.name && <>Fabric: {fabric.name}<br/></>}
//                             ${order.total_price} (Balance: ${order.balance_due})
//                             {order.photos.length > 0 && <div><img src={order.photos[0]} width="100" /></div>}
//                             <button onClick={() => cloneOrder(order)} style={{ fontSize: '12px' }}>Repeat Order</button>
//                           </div>
//                         )}
//                       </Draggable>
//                     );
//                   })}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           </div>
//         ))}
//       </div>
//     </DragDropContext>
//   );
// };

// export default OrderPipeline;