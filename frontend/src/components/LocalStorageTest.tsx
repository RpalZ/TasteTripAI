'use client'

import { useState, useEffect } from 'react'

export default function LocalStorageTest() {
  const [localStorageStatus, setLocalStorageStatus] = useState<string>('Checking...')
  const [testResult, setTestResult] = useState<string>('')

  useEffect(() => {
    // Test localStorage availability
    try {
      if (typeof window === 'undefined') {
        setLocalStorageStatus('❌ Window not available (SSR)')
        return
      }

      if (!window.localStorage) {
        setLocalStorageStatus('❌ localStorage not available')
        return
      }

      // Test basic localStorage functionality
      const testKey = 'tastetrip_test'
      const testValue = { test: 'data', timestamp: Date.now() }
      
      // Test write
      localStorage.setItem(testKey, JSON.stringify(testValue))
      
      // Test read
      const retrieved = localStorage.getItem(testKey)
      const parsed = JSON.parse(retrieved || '{}')
      
      // Test delete
      localStorage.removeItem(testKey)
      
      if (parsed.test === 'data') {
        setLocalStorageStatus('✅ localStorage working properly')
        setTestResult(`Test successful - wrote and read: ${JSON.stringify(parsed)}`)
      } else {
        setLocalStorageStatus('❌ localStorage read/write test failed')
        setTestResult(`Expected: ${JSON.stringify(testValue)}, Got: ${JSON.stringify(parsed)}`)
      }
    } catch (error) {
      setLocalStorageStatus('❌ localStorage error')
      setTestResult(`Error: ${error}`)
    }
  }, [])

  const testRecommendationStorage = () => {
    try {
      const testKey = 'tastetrip_recommendations_test'
      const testRecommendations = [
        {
          title: 'Test Restaurant',
          type: 'place',
          description: 'A test restaurant',
          entity_id: 'test_123',
          name: 'Test Restaurant',
          subtype: 'urn:entity:place'
        }
      ]
      
      const dataToStore = {
        recommendations: testRecommendations,
        timestamp: Date.now(),
        conversationId: 'test_conversation'
      }
      
      localStorage.setItem(testKey, JSON.stringify(dataToStore))
      
      const retrieved = localStorage.getItem(testKey)
      const parsed = JSON.parse(retrieved || '{}')
      
      setTestResult(`Recommendation storage test: ${parsed.recommendations?.length || 0} recommendations stored`)
      
      // Clean up
      localStorage.removeItem(testKey)
    } catch (error) {
      setTestResult(`Recommendation storage test failed: ${error}`)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">localStorage Test</h3>
      <p className="mb-2">Status: {localStorageStatus}</p>
      <p className="mb-4 text-sm text-gray-600">{testResult}</p>
      <button 
        onClick={testRecommendationStorage}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Recommendation Storage
      </button>
    </div>
  )
} 