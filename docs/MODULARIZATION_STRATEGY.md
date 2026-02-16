# Modularization & Service Extraction Strategy

This document outlines a strategic plan for evolving the application from its current modular monolith architecture towards a microservices-based architecture. This is an optional, long-term plan that should only be enacted if and when the application's complexity and scale warrant it.

## 1. Current Architecture

The application is currently a modular monolith. This architecture provides a good balance of development speed and code organization. The core domains (trips, trucks, payments, etc.) are logically separated within the codebase, but they are all deployed as a single unit.

## 2. When to Consider Extraction

The primary drivers for extracting a module into a separate service are:

- **High-Risk Domains:** Domains that are critical to the business and have a high cost of failure.
- **High-Complexity Domains:** Domains that are becoming increasingly complex and are difficult to maintain within the monolith.
- **High-Scale Domains:** Domains that have significantly different scaling requirements than the rest of the application.
- **Team Structure:** As the development team grows, it may be beneficial to have separate teams own separate services.

## 3. Candidate Domains for Extraction

Based on the current understanding of the application, the following domains are the most likely candidates for future extraction:

### 3.1. Payments

- **Rationale:** Payments are a high-risk domain. A failure in the payments module could have a direct financial impact on the business. Extracting payments into a separate service would allow it to be developed and deployed independently, with a higher level of scrutiny and testing.
- **Extraction Strategy:**
    1.  Create a new, independent service for handling all payment-related logic.
    2.  This service would expose a well-defined API for creating and managing payments.
    3.  The monolith would then be updated to call this new service instead of its own internal payments module.
    4.  The old payments module would be deprecated and eventually removed.

### 3.2. Notifications

- **Rationale:** Notifications have different scaling requirements than the rest of the application. A sudden spike in notifications could put a strain on the monolith. Extracting notifications into a separate service would allow it to be scaled independently.
- **Extraction Strategy:**
    1.  Create a new service for handling all notifications (email, SMS, push).
    2.  This service would likely be event-driven, consuming events from a message bus (e.g., RabbitMQ, Kafka).
    3.  The monolith would publish events to the message bus instead of sending notifications directly.

### 3.3. Verification

- **Rationale:** The verification process (e.g., for drivers, trucks) is a distinct business process that could be encapsulated in its own service. This would also allow for the possibility of using different verification providers in the future without impacting the core application.
- **Extraction Strategy:**
    1.  Create a new service for handling all verification logic.
    2.  This service would expose an API for initiating and checking the status of verifications.
    3.  The monolith would call this service to manage the verification process.

## 4. Guiding Principles

- **Strangler Fig Pattern:** Use the Strangler Fig pattern to gradually migrate functionality from the monolith to the new services.
- **Well-Defined APIs:** Each new service should have a well-defined, stable API.
- **Independent Deployments:** Each new service should be independently deployable.
- **Observability:** Each new service should have its own monitoring, logging, and alerting.