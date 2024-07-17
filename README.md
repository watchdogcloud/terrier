<div align='center'>

# Watchdog - Terrier Config and Management Server

<img src=".github/logo.png" alt="canario.png" width='150'></img>

<hr>

![example workflow](https://github.com/watchdogcloud/terrier/actions/workflows/ghcr-deploy.yml/badge.svg)

</div>


Terrier is the core configuration and management server that forms the backbone of the Watchdog ecosystem,from handling requests from all Watchdog Client SDKs to maintaining communication and management of Kafka Brokers across distributed systems.

### Core 

Terrier Sends timely alerts to stakeholders based on predefined thresholds and conditions. Alerts notify stakeholders about critical issues affecting system health and performance.Currently the server uses SMTP Mailing to send notifications regarding hardware issues like Resource Spikes and Cumulative Threshold overflows.


### Spike Triggers
These are triggers that detect sudden and significant changes in the metric values, indicating potential issues that need immediate attention.

> Example : If the CPU usage suddenly spikes from 30% to 90% within a minute, a spike trigger will detect this abrupt change and send an alert to notify stakeholders of a potential issue requiring immediate investigation.


### Cumulative Triggers
These triggers detect gradual changes in metric values over time, indicating potential issues that may arise if the trend continues.

> Example : If memory usage steadily increases by 5% each hour over a day, a cumulative trigger will recognize this trend and alert stakeholders ,indicating that there might be a memory leak or inefficient resource usage that could cause problems if not addressed.


Terrier continuously streams real-time metrics concerning disk usage, RAM, and memory utilization (for now). These metrics are important for monitoring application health and performance, giving insights into resource utilization and potential bottlenecks. Over this data , workers perform computational tasks - It aggregates, analyzes, and computes metrics to detect anomalies, trends, and patterns indicative of system health or operational issues.

Internally, Terrier manages Kafka clusters, brokers, producers, and consumers. It ensures the operation of Kafka messaging infrastructure & ensures reliable data ingestion and stream processing.

It also Persistently stores historical metrics and metadata,project and user authentication information , configuration settings, and operational data in a NoSQL DB.


## Installation

> [!NOTE]
> Terrier relies on Kafka, Zookeeper, and Redis to facilitate communication between services and data computation. Terrier won't work without it's dependencies.

### Prerequisites

1. **Kafka**: A distributed event streaming platform capable of handling trillions of events a day,if configured properly.
2. **Zookeeper**: A centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services.
3. **Redis**: An in-memory data structure store, used as a database, cache, and message broker.

### Configuration

To configure Terrier, edit the `config/default.json` file. Below are the attributes and their descriptions:


| Attribute | Description |
|-----------|-------------|
| `host` | The hostname or IP address where the Terrier server will run. |
| `port` | The port number on which the Terrier server will listen. |
| `public` | The path to the public directory for serving static files. |
| `paginate.default` | The default number of items per page for pagination. |
| `paginate.max` | The maximum number of items per page for pagination. |
| `authentication.entity` | The entity to authenticate (e.g., user). |
| `authentication.service` | The service used for authentication (e.g., users). |
| `authentication.secret` | The secret key for JWT authentication. |
| `authentication.authStrategies` | The authentication strategies to use (e.g., jwt, local). |
| `authentication.jwtOptions.header` | Custom headers for the JWT, such as the type (`typ`). |
| `authentication.jwtOptions.audience` | The audience that the JWT is intended for. This helps to ensure the token is being sent to the correct recipient. |
| `authentication.jwtOptions.issuer` | The issuer of the JWT. This helps to ensure the token was issued by a trusted source. |
| `authentication.jwtOptions.algorithm` | The algorithm used to sign the JWT, such as `HS256`. |
| `authentication.jwtOptions.expiresIn` | The duration after which the JWT will expire, for example, `'365d'` for 365 days. |
| `authentication.local.usernameField` | The field for the username in local authentication. |
| `authentication.local.passwordField` | The field for the password in local authentication. |
| `mongodb` | The MongoDB connection string. |
| `otpless.clientId` | The client ID for OTP-less authentication.Get one from `https://otpless.com/` |
| `otpless.clientSecret` | The client secret for OTP-less authentication. Get one from `https://otpless.com/`|
| `otpless.expiry` | The expiration time for OTPs in seconds. |
| `otpless.otpLength` | The length of the OTP. |
| `otpless.hash` | The hashing algorithm used for OTPs. |
| `kafkaConf.bootstrap_servers` | The list of Kafka bootstrap servers. |
| `kafkaConf.topics.name` | The name of the Kafka topic. |
| `kafkaConf.topics.numPartitions` | The number of partitions for the Kafka topic. A common practice is to set the number of partitions to a multiple of the number of consumers. This ensures an even distribution of workload among consumers.|
| `kafkaConf.topics.replicationFactor` | The replication factor for the Kafka topic. |
| `keygen.length` | The length of the generated keys. |
| `smtp.email` | The SMTP email address used for sending emails. |
| `smtp.password` | The SMTP password used for sending emails. |
| `smtp.host` | The SMTP server host. |
| `smtp.port` | The SMTP server port. |
| `smtp.secure` | Whether to use a secure connection for SMTP. |
| `alerts.spike.cpu` | The CPU usage threshold for spike alerts. |
| `alerts.spike.mem` | The memory usage threshold for spike alerts. |
| `alerts.spike.disk` | The disk usage threshold for spike alerts. |
| `alerts.cumulative.cpu` | The CPU usage threshold for cumulative alerts. |
| `alerts.cumulative.mem` | The memory usage threshold for cumulative alerts. |
| `alerts.cumulative.disk` | The disk usage threshold for cumulative alerts. |
| `alerts.cumulative.durationInMin` | The duration in minutes for cumulative alerts. |

A sample configuration file is present at `config/test.json`

### JWT Options

The `authentication.jwtOptions` configuration allows you to customize the properties of the JWT (JSON Web Token) used for authentication. Here's a detailed explanation of each option:

- **header**: An object specifying custom headers for the JWT. The `typ` field typically indicates the type of token, usually set to "access".

> [!TIP]
> Ensure the `typ` is set correctly to differentiate between access and refresh tokens.
- **audience**: The audience that the JWT is intended for. This is usually the URL of your application or service. It ensures that the token is being sent to the correct recipient.

> [!TIP]
> Use a consistent audience string across your services to simplify token validation.
- **issuer**: The issuer of the JWT, usually your application's name or URL. This ensures that the token was issued by a trusted source.

> [!TIP] 
> Match the issuer with the domain of your application to avoid token spoofing.
- **algorithm**: The algorithm used to sign the JWT. Common algorithms include `HS256` (HMAC using SHA-256).

> [!TIP]
> Consider using stronger algorithms like `RS256` for enhanced security, especially in production environments.
- **expiresIn**: The duration after which the JWT will expire. It can be specified in seconds or as a string describing a time span (e.g., `'365d'` for 365 days).

> [!TIP]
> Set an appropriate expiry time to balance security and user convenience. Shorter expiry times enhance security but may require more frequent re-authentication.

### Running the Server

Use Docker Compose to start the Terrier server along with its dependencies. This command will start the services defined in your `docker-compose.yml` file.

```sh
docker-compose -f docker/docker-compose.yml up
```

> [!TIP]
> Use the `-d` flag to run the services in the background

### Kafka UI

Terrier is integrated with Kafka UI, an OSS graphical user interface to manage and view the state of Kafka. This includes monitoring current messages, topics, consumer groups, and more.

- Access Kafka UI: Kafka UI runs on port 8080. You can access it by navigating to `http://localhost:8080` in your web browser.


### Architectural Reasons

Terrier supports the dynamic scaling of Kafka clusters and other components to handle varying workloads and data volumes efficiently across multiple projects.

Project is aimed at offering flexibility through APIs and interfaces for integration with Third-party tools and custom applications. This allows organizations to extend and customize Terrier's functionality according to specific operational requirements.

### Future Development

Terrier's upcoming development roadmap:

- Dashboard for Real-Time Stream Monitoring
- Advanced Alerting Mechanisms

For updates, documentation, and community support, visit the [Terrier GitHub repository](https://github.com/watchdogcloud/terrier). 

Enjoy monitoring with Terrier! 🐕

