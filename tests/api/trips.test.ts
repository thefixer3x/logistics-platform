import { GET, POST } from '@/app/api/trips/route'
import { createRequest } from 'node-mocks-http'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest } from 'next/server'
import { describe, it, expect, beforeEach, mock } from "bun:test";
import { mockAdmin, mockDriver, mockSupervisor } from '../utils/auth';

// Mock the Supabase client using bun:test
mock.module('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: mock(),
}))

describe('API /api/trips', () => {
  let supabaseMock: any

  beforeEach(() => {
    // Reset mocks before each test
    mock.restore()

    supabaseMock = {
      auth: {
        getSession: mock(),
      },
      from: mock().mockReturnThis(),
      select: mock().mockReturnThis(),
      insert: mock().mockReturnThis(),
      update: mock().mockReturnThis(),
      eq: mock().mockReturnThis(),
      order: mock().mockReturnThis(),
      limit: mock().mockReturnThis(),
      single: mock(),
      channel: mock().mockReturnThis(),
      send: mock().mockReturnThis(),
    };

    (createRouteHandlerClient as any).mockReturnValue(supabaseMock)
  })

  describe('GET', () => {
    it('should return 401 Unauthorized if no session is found', async () => {
      // Arrange
      supabaseMock.auth.getSession.mockResolvedValue({ data: { session: null } })
      const req = createRequest({
        method: 'GET',
        url: 'http://localhost/api/trips',
      }) as unknown as NextRequest

      // Act
      const response = await GET(req)

      // Assert
      expect(response.status).toBe(401)
      const body = await response.json()
      expect(body).toEqual({ error: 'Unauthorized' })
    })

    it('should return a list of trips for a supervisor', async () => {
      // Arrange
      const { session } = mockSupervisor
      const mockTrips = [{ id: 1, origin: 'Lagos', destination: 'Abuja' }]
      supabaseMock.auth.getSession.mockResolvedValue({ data: { session } })
      supabaseMock.single.mockResolvedValue({ data: { role: 'supervisor' } })
      supabaseMock.select.mockResolvedValue({ data: mockTrips, error: null })

      const req = createRequest({
        method: 'GET',
        url: 'http://localhost/api/trips',
      }) as unknown as NextRequest

      // Act
      const response = await GET(req)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body).toEqual({ trips: mockTrips })
    })

    it('should filter trips by driver ID for users with "driver" role', async () => {
      // Arrange
      const { session } = mockDriver
      supabaseMock.auth.getSession.mockResolvedValue({ data: { session } })
      supabaseMock.single.mockResolvedValue({ data: { role: 'driver' } })
      supabaseMock.select.mockResolvedValue({ data: [], error: null })

      const req = createRequest({
        method: 'GET',
        url: 'http://localhost/api/trips',
      }) as unknown as NextRequest

      // Act
      await GET(req)

      // Assert
      expect(supabaseMock.eq).toHaveBeenCalledWith('driver_id', session.user.id)
    })
  })

  describe('POST', () => {
    const newTripData = {
      truck_id: 'truck-1',
      driver_id: 'driver-1',
      customer_id: 'customer-1',
      origin: 'Lagos',
      destination: 'Ibadan',
    }

    it('should allow a supervisor to create a trip', async () => {
      // Arrange
      const { session } = mockSupervisor
      supabaseMock.auth.getSession.mockResolvedValue({ data: { session } })
      supabaseMock.single.mockResolvedValueOnce({ data: { role: 'supervisor' } }) // Permission check
                         .mockResolvedValueOnce({ data: { status: 'available' } }) // Truck check
                         .mockResolvedValueOnce({ data: { role: 'driver' } }) // Driver check
      supabaseMock.select.mockResolvedValue({ data: { id: 'new-trip-id', ...newTripData }, error: null })

      const req = {
        method: 'POST',
        url: 'http://localhost/api/trips',
        body: newTripData,
        json: async () => newTripData,
      } as unknown as NextRequest

      // Act
      const response = await POST(req)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.trip_id).toBe('new-trip-id')
      expect(supabaseMock.insert).toHaveBeenCalled()
    })

    it('should prevent a driver from creating a trip', async () => {
      // Arrange
      const { session } = mockDriver
      supabaseMock.auth.getSession.mockResolvedValue({ data: { session } })
      supabaseMock.single.mockResolvedValue({ data: { role: 'driver' } }) // Permission check

      const req = {
        method: 'POST',
        url: 'http://localhost/api/trips',
        body: newTripData,
        json: async () => newTripData,
      } as unknown as NextRequest

      // Act
      const response = await POST(req)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(403)
      expect(body).toEqual({ error: 'Insufficient permissions' })
    })
  })
})
