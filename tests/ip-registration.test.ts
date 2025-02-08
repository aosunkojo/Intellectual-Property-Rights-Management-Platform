import { describe, it, expect, beforeEach } from 'vitest';

// Mock storage for IP registrations
let ipRegistrations = new Map();
let nextIpId = 0;

// Mock functions to simulate contract behavior
function registerIp(title: string, description: string) {
  const ipId = nextIpId++;
  ipRegistrations.set(ipId, {
    owner: 'mock-owner-address',
    title,
    description,
    creationDate: Date.now(),
    registrationDate: Date.now(),
    status: 'registered'
  });
  return ipId;
}

function updateIpStatus(ipId: number, newStatus: string) {
  if (!ipRegistrations.has(ipId)) {
    throw new Error('IP not found');
  }
  const ip = ipRegistrations.get(ipId);
  ip.status = newStatus;
  ipRegistrations.set(ipId, ip);
}

function getIpRegistration(ipId: number) {
  return ipRegistrations.get(ipId);
}

describe('IP Registration Contract', () => {
  beforeEach(() => {
    ipRegistrations.clear();
    nextIpId = 0;
  });
  
  it('should register new IP', () => {
    const ipId = registerIp('Test IP', 'This is a test IP description');
    expect(ipId).toBe(0);
    expect(ipRegistrations.size).toBe(1);
  });
  
  it('should update IP status', () => {
    const ipId = registerIp('Test IP', 'This is a test IP description');
    updateIpStatus(ipId, 'approved');
    const ip = getIpRegistration(ipId);
    expect(ip.status).toBe('approved');
  });
  
  it('should get IP registration', () => {
    const ipId = registerIp('Test IP', 'This is a test IP description');
    const ip = getIpRegistration(ipId);
    expect(ip).toBeDefined();
    expect(ip.title).toBe('Test IP');
    expect(ip.description).toBe('This is a test IP description');
  });
  
  it('should throw an error when updating non-existent IP', () => {
    expect(() => updateIpStatus(999, 'approved')).toThrow('IP not found');
  });
});
