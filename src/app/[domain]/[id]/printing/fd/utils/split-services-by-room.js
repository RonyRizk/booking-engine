export function splitServicesByRoom(services, rooms) {
  const roomIds = new Set((rooms ?? []).map((room) => room.identifier));

  const byRoom = new Map();
  const general = [];

  for (const service of services ?? []) {
    const roomId = service.room_identifier;
    if (roomId != null && roomIds.has(roomId)) {
      if (!byRoom.has(roomId)) byRoom.set(roomId, []);
      byRoom.get(roomId).push(service);
    } else {
      general.push(service);
    }
  }

  return { byRoom, general };
}
