import { describe, it, expect, beforeEach } from "vitest"

// Mock storage for licenses
const licenses = new Map()
let nextLicenseId = 0

// Mock functions to simulate contract behavior
function createLicense(ipId: number, licensee: string, terms: string, duration: number) {
  const licenseId = nextLicenseId++
  licenses.set(licenseId, {
    ipId,
    licensor: "mock-licensor-address",
    licensee,
    terms,
    startDate: Date.now(),
    endDate: Date.now() + duration * 1000,
    status: "active",
  })
  return licenseId
}

function updateLicenseStatus(licenseId: number, newStatus: string) {
  if (!licenses.has(licenseId)) {
    throw new Error("License not found")
  }
  const license = licenses.get(licenseId)
  license.status = newStatus
  licenses.set(licenseId, license)
}

function getLicense(licenseId: number) {
  return licenses.get(licenseId)
}

describe("Licensing Contract", () => {
  beforeEach(() => {
    licenses.clear()
    nextLicenseId = 0
  })
  
  it("should create a new license", () => {
    const licenseId = createLicense(0, "licensee-address", "Test terms", 30 * 24 * 60 * 60) // 30 days
    expect(licenseId).toBe(0)
    expect(licenses.size).toBe(1)
  })
  
  it("should update license status", () => {
    const licenseId = createLicense(0, "licensee-address", "Test terms", 30 * 24 * 60 * 60)
    updateLicenseStatus(licenseId, "terminated")
    const license = getLicense(licenseId)
    expect(license.status).toBe("terminated")
  })
  
  it("should get license details", () => {
    const licenseId = createLicense(0, "licensee-address", "Test terms", 30 * 24 * 60 * 60)
    const license = getLicense(licenseId)
    expect(license).toBeDefined()
    expect(license.licensee).toBe("licensee-address")
    expect(license.terms).toBe("Test terms")
  })
  
  it("should throw an error when updating non-existent license", () => {
    expect(() => updateLicenseStatus(999, "terminated")).toThrow("License not found")
  })
})

