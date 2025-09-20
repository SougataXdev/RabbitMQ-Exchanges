/*
 * FANOUT EXCHANGE - RabbitMQ
 * 
 * DEFINITION:
 * A fanout exchange routes messages to all bound queues regardless of routing keys.
 * It broadcasts every message to every queue that is bound to the exchange,
 * ignoring routing keys completely and providing a publish-subscribe pattern.
 * 
 * KEY POINTS:
 * • Ignores routing keys completely (can be empty or any value)
 * • Broadcasts messages to ALL bound queues simultaneously
 * • Implements true publish-subscribe messaging pattern
 * • Fastest exchange type due to no routing logic complexity
 * • Perfect for scenarios requiring message duplication across multiple consumers
 * 
 * REAL-WORLD APPLICATIONS:
 * 1. LIVE UPDATES: Broadcast real-time updates to multiple dashboards (e.g., stock prices, sports scores)
 * 2. CACHE INVALIDATION: Notify all cache servers to invalidate specific data simultaneously
 * 3. SYSTEM ALERTS: Send critical alerts to all monitoring systems and notification channels
 */

