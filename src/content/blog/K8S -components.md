---
title: "Kubernetes Components and Functions:"
description: "Kubernetes is a open source platform design to scale, automate and manage containerized applicayions. Two manin components of K8S : Control plane (Master Node) and worker Node. Everything in kubernetes is a manifest file."
pubDate: '2025-12-05'
heroImage: '../../assets/images/example-blog-hero1.jpg'
category: 'DevOps'
tags: ['kubernetes', 'k8s', 'pods', 'containers', 'devops']
---
## description: "Control Plane Components and Functions:"

**APT Server:**
API server is responsible for all comunnication within the clusterAPI server is the central management unit or entry point of K8S cluster. All requests must go through APT server

**Function:**
-Receive and validate all requests -The API Server checks the credentials provided in the request like certificates and Autheticate the request. -API server than checks for the authorization if your identity is bound to a Role that has the necessary permission the request is authorized. Admission Controllers are code modules inside the API Server that intercept the request. The request is checked against cluster policies and best practices before it is stored.

**Kube-Scheduler:**
The Scheduler is responsible for figuring out which Worker Node is the best fit to run a newly created Pod.

**Function:**
-Watches the API Server for new Pods that haven't been assigned a node. -Narrows down the list of all available nodes to only those that meet the Pod's requirements. -Scoring Assigns a score to the remaining nodes based on optimization goals. It then selects the node with the highest score and updates the Pod's specification in the API Server.

**Controler Manager:**
The Controller Manager is a core control-plane component responsible for running all the built-in controllers that continuously regulate the state of the cluster. The Kubernetes Controller Manager runs a set of background processes called controllers. Each controller watches some part of the cluster’s state and makes changes to move the actual state toward the desired state defined in the API server.

**Function:**
-Observe the current cluster state from the API server. -Compare it with the desired state defined by the user. -Act to fix differences (create pods, delete pods, update objects, etc.)

**Key Controllers Inside the Controller Manager:**
1	Node Controller: Detects and responds when nodes go down Marks nodes as NotReady Evicts pods from unhealthy nodes
2	Replication/ReplicaSet Controller: Ensures the correct number of pod replicas exist Creates or removes pods automatically
3	Deployment Controller: Manages rolling updates and rollbacks
4	StatefulSet Controller: Ensures ordered and stable pod identities Maintains unique network identifiers
5	DaemonSet Controller: Ensures a pod runs on every (or selected) node
6	Job & CronJob Controller: Manages batch jobs and scheduled jobs
7	Service Account & Token Controllers: Create default service accounts Manage API tokens for pods
8	EndpointSlice / Service Controller: Keeps Service → Pod mappings updated
ETCD:
The brain and memory of the Kubernetes cluster. It holds the desired state of all Kubernetes objects.If you create a Deployment, Pod, Service that data is saved in etcd.

**Function:**
-It guarantees that all nodes in the cluster see the same data, even in failures. -Data is stored as simple keys and values. -Kubernetes controllers use etcd for determining leaders Worker Node componebts and functions: The Worker Node (also called a compute node) is where your application workloads—the Pods—actually run. It is managed by the Control Plane.

**Kubelet:**
The Kubelet is the main agent on the node. It is the intermediary that communicates with the Control Plane's API Server to ensure that the containers defined in the Pod specifications are running and healthy on the node.

**Function:**
-Registers the node with the Kubernetes cluster and reports its resource capacity. -Watches the API Server for PodSpecs assigned to its node by the Scheduler. It then instructs the Container Runtime to start, stop, or update containers to match the desired state. -Continuously monitors the health and status of its containers and reports this information back to the API Server. -Manages pods defined by local manifest files on the node.

**Container Runtime:**
The Container Runtime is the software responsible for executing the containers. The Kubelet uses the Container Runtime Interface (CRI) to communicate with it.

**Function:**
-Pulls the required container images from a registry (like Docker Hub or a private registry). -Starts and stops the containers based on instructions from the Kubelet. -containerd (most common), CRI-O, and older versions of Docker Engine supported by it. Kube-Proxy : The Kube-Proxy is a network proxy that runs on every node. It is responsible for making Kubernetes networking work by enabling communication between Pods and outside traffic. Function: -It watches the API Server for new Services and Endpoints. -It programs and maintains network rules (usually using iptables or IPVS) on the node's operating system to direct traffic destined for a Service's virtual IP to the correct backend Pod. -Provides simple, round-robin load balancing across all the Pods belonging to a particular Service.




Think of Kubernetes as a big automated system that runs your applications across many machines.
In that world, a **Pod** is the **smallest deployable unit**.

👉 **A Pod is a wrapper around one or more containers** (most commonly Docker containers).
It groups containers that **must run together**.

## 💡 Simple Analogy

Imagine a pod as a **small house**. Inside the house, you can have one or more **rooms** (containers).
All rooms share:

- the same address (IP)
- the same (optional) storage
- the same network

People living in the same house can talk to each other easily.
Likewise, containers inside the same Pod communicate over `localhost` and share the same network space.

## 🎯 Why Do We Need Pods?

Containers are usually **small, single-purpose units**.
Sometimes you need multiple containers to work as a **single team**. For example:

- Main app container
- Helper container that downloads files, processes logs, or updates configs

Kubernetes groups these containers in a Pod so they:

- start together
- stop together
- share network
- *optionally* share files via volumes

This makes complex applications easier to manage and reason about.

## 🧩 What Does a Pod Contain?

A Pod usually includes:

- **Containers** – one main container plus optional sidecars
- **Storage (Volumes)** – optional shared folders mounted into containers
- **Network** – each Pod gets **one IP address** shared by all containers
- **Metadata** – name, labels, annotations
- **Spec** – how the Pod should behave (restart policy, resources, etc.)

## ⚙️ How Pods Work Under the Hood

When you create a Pod (via YAML or `kubectl`), Kubernetes goes through several steps.

### 1️⃣ You Apply a Pod Manifest

Example YAML:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: app
      image: nginx
```

You run:

```bash
kubectl apply -f mypod.yaml
```

### 2️⃣ API Server Receives the Request

The Kubernetes **API server**:

- validates your YAML
- stores the desired state in **etcd** (Kubernetes' key-value store)

### 3️⃣ Scheduler Picks a Node

The **kube-scheduler** decides where to run the Pod by checking:

- which node has enough CPU and memory?
- which node satisfies constraints (taints, tolerations, affinities)?

Then it assigns the Pod to a node.

### 4️⃣ Kubelet Creates the Containers

On the chosen node:

- **kubelet** (the node agent) reads the Pod spec
- kubelet asks the container runtime (Docker, containerd, CRI-O, etc.) to start the containers

You can think of it like:

> kubelet → container runtime → start containers

### 5️⃣ Pod Network Is Attached

Every Pod gets an IP from the **cluster network plugin**, such as:

- Flannel
- Calico
- Cilium

The plugin configures networking so the Pod can talk to:

- other Pods
- nodes
- services

### 6️⃣ Pod Sandbox and the Pause Container

Kubernetes creates a tiny **pause container** (sometimes called the *infra container*).

This container:

- holds the Pod’s **network namespace**
- keeps the Pod’s **IP address** alive
- acts as the **parent** for other containers sharing that network

All other containers in the Pod join this namespace and share the same IP.

### 7️⃣ Pod Runs and Is Monitored

Kubelet continuously:

- checks container health
- restarts containers when needed
- reports Pod status back to the API server

### 8️⃣ Pod Lifecycle Phases

A Pod can go through phases like:

- **Pending** – waiting to be scheduled or pulled
- **Running** – at least one container is running
- **Succeeded** – all containers exited successfully
- **Failed** – at least one container failed
- **Unknown** – state cannot be determined

## 📦 Pod Types

### 1. Single-Container Pod

The most common case: **one app per Pod**.

### 2. Multi-Container Pod

Two or more containers that:

- share storage
- share network/IP
- may share process namespace

Often used for:

- sidecar containers
- logging agents
- proxies

## 🔄 Pods Are Ephemeral

Pods are **not permanent**. They can disappear because of:

- node failures
- out-of-memory (OOM) events
- eviction by the scheduler
- manual deletion

In real-world setups, we rarely create standalone Pods in production.
Instead, we use higher-level controllers such as:

- **Deployments**
- **ReplicaSets**
- **DaemonSets**
- **StatefulSets**

These controllers automatically recreate Pods to maintain the desired state.

## 🚀 Container Roles Inside a Pod

Inside a Pod, containers often fall into three roles.

### 1. Main Container (Primary Container)

This is the **main application** container.

**Purpose**

- Runs the app that the Pod was created for.

**Examples**

- Nginx web server
- Node.js backend
- Python API

### 2. Init Container

An **init container** runs **before** the main container starts.

**Purpose**

- prepare the environment
- wait for dependencies to be ready
- download configuration or files

**Behavior**

- runs one by one, in order
- must **succeed** before the main container starts

**Example** – wait for a database:

```yaml
initContainers:
  - name: wait-for-db
    image: busybox
    command: ["sh", "-c", "until nc -z db 3306; do sleep 2; done"]
```

### 3. Sidecar Container

A **sidecar container** runs **alongside** the main container.

**Purpose**

- supports or extends the main container
- runs in parallel for as long as the Pod is alive

**Common use cases**

- logging agents (e.g., Fluentd)
- proxies (Envoy, Istio sidecar)
- metrics or monitoring agents
- Git sync or file sync processes

Sidecars share storage and network with the main container, making it easy to collaborate.

### Putting It Together

A Pod can have:

- 1 init container (runs first → finishes → stops)
- 1 main container (runs the app)
- 1 or more sidecar containers (run alongside the main container)


