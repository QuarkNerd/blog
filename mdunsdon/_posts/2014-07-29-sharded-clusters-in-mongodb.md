---
author: mdunsdon
title: "Sharded Clusters in MongoDB"
categories:
tags:

summary: "Sharded clusters enable the data persistence layer in MongoDB to be shared across several machines.  In this post, we will firstly look the key considerations you should make before you use sharded clusters.  Once this is done, I will should you the performance metrics I collected and what they tell use about sharded clusters."
layout: default_post
---

When using MongoDB as a data persistence layer, there comes a point when increasing the specifications of a single machine no longer yields the return in performance that is needed.  MongoDB seeks to mitigate this issue, by splitting the persistence layer across multiple machines, and offers a sharded cluster feature to facilitate this.

After setting up and exploring sharded clusters in MongoDB for myself, I have written this post to explore three factors that should to be considered before making the transition:

1. Sharded clusters introduce additional deployment and maintainability costs, so you need to evaluate whether it will be beneficial.
1. The performance of a sharded cluster is primarily based upon how the data is split between machines and your typical usage patterns.
1. When machines or large batches of data is added to an existing cluster, background loads are introduced to split and distribute data.

###Motivation

There are two main reason for me carrying out research regarding sharded clusters and documenting my findings.  First of all, there are companies who are using a whole variety of techniques to keep their own systems performing well under increasing loads.  From my perspective, the fact that they can do this greatly interests me and has encouraged me to build a sharded cluster in MongoDB for myself.  Maybe it will encourage you to build your own too.

The other motivating factor is that whilst there are blog posts and videos discussing how MongoDB can scale, I have not come across any data showing how performance metrics change as more machines are added or as the distribution of data changes across machines.  Whilst there is no expectation that I can generate performance metrics that will mimic every usage case of MongoDB, I am anticipating that there will be interesting and useful observations that can be drawn.

###Introduction to Sharded Clusters

MongoDB contains a database server component that is responsible for persisting data and carrying out queries on that data.  With this component on a single machine there are operational concerns as this introduces a single point of failure.  MongoDB's replica set feature comes to the rescue, and allows 'secondary' machines to replicate the data on the 'primary' and be ready to take over on a failure.

Whilst a replica set can alleviate some operational risks, and are typically found in all MongoDB production environments, they do not aim to split data or the workload across the machines.  This is where sharded clusters come in, as it enables a replica set (or single database instance) to become a shard.

Each shard in a sharded cluster exclusively holds onto a set of chunks. These chunks describe a subset of data stored and can be migrated from one shard to another, either to maintain an even distribution of data or to handle shards being added or removed from the cluster.  It is this distribution that provides all the power as data interactions can be routed to a single shard and so reduce the load on other shards.

##Consider: Will the benefits outweigh the costs?

If you are not currently using a shard cluster in MongoDB, you are forced to increase the specifications of your replica set machines to cope with additional load.  For some systems this approach works well, but there does come a point for some where this does not become worthwhile.

<img src="{{ site.baseurl }}/mdunsdon/assets/mongo-sharding-infrastructure.png"/>

Before you can bring a production MongoDB system over to using a sharded cluster, there are additional costs that you need to bear. Not only do you need to duplicate your existing replica set, but you need set up the following:

- A _configuration server_ is essential for mapping data chunks to shards. A shared cluster can not function without this, so you should set up three of these servers in production and have a data backup strategy.

- A _router server_ server routes actions triggered by your applications to the correct shard.  In a production environment is may be necessary to have multiple of these to handle fail-over.

In order to evaluate whether this is the right choice for you, the most important action for you to take is to be collecting performance metrics over time.  The data you generate should allows you to forecast resources requirements -- _volatile memory (RAM), storage requirements, processor speeds and disk I/O speeds_.

Your ability to make forecasts is important, for you need to see whether it is cheaper to have the hardware requirements you need all on a single machine or whether it is more financally viable to spread your requirements over several machines.  There is only so many cores that you can fit in one machine and only so much I/O you can transfer from a single machine, so technology may force you hand in the future and require you to think about transitioning to a sharded cluster.


##Consider: How should data be split into chunks?

The performance benefits in a sharded cluster are highly dependant on how data is split into chucks, and this is all based upon a shard key.  This shard key provides an ordering over the data and this is used to split the data into chunks.  There are three aspects to consider when defining this shard key.

<img src="{{ site.baseurl }}/mdunsdon/assets/mongo-sharding-chunks.png"/>

Firstly, the read and write queries should be _spread evenly_ across all the shards without any biases.  This means that the shard key should spread data across all shards and have a fair amount of variablity.  When done right, this resolves issues regard write contention, as the write are shard across the shards.

Secondly, each read or write should only _target at an individual shard_.  For the shard key, this would mean that  it needs to keep together data that is returned by common queries.  This is useful for ranged based queries as there is lower overhead collating data from one shard compared to multiple shards.

Finally, the shard key value should be _distinct across the data_.  This is important to consider as chucks divides the data by using the shard key, and data with the same shard key value will always kept in the same chunk.

Meeting all these criteria is not feasible in practice, when you are choosing a shard key, so you need to focus on the typical usage patterns of your data.  This may require a fair amount of initial experimentation.  When your system goes into production the performance of your shard key should be regularly monitored, as this should give you insight about your current usage patterns and help you be proactive when these patterns change.


##Consider: What is the impact of maintenance tasks?

As part of the sharded cluster feature of MongoDB, it employs a balancer to distribute chunks evenly between shards.  Whilst this helps keep the overall system scalable, there is an additional load placed across the sharded cluster when chunks are transferred.

A side effect of this is that when machines are added or removed from a sharded cluster, the balancer is going to move chunks between shards.  This is another motivator for monitoring performance metrics, as it allows you to be proactive with adding machines rather than being reactive and adding a temporarty additional load when the system is already under strain.

When data is added to a sharded cluster, chunks are going to be split and distributed on the fly.  This means that when a large amount of data is being added, the balancer is adding data to chunks that are going to be split as more data comes in and then these new chunks will get transferred to another shard -- all of which introduces additional load.

If you can predict the amount of data you will be recieving and the range of values you shard key will have, it may be possible for you to manual split chunk beforehand. By doing so, the data will be written to a chunk that is unlikely to be automatically split to be transferred to another shard.

##My findings
Working progress
The research I have done into sharded clusters into MongoDB has involved me setting up a sharded cluster in Digital Ocean.  **Data 60GB randomly generated log data**

````
{
	_id: FA09696D67C,
    datestamp: 29/07/2014T09:04:00,
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt",
    // severity_score has a cardinality of 100, with an uneven distribution
    severity_score: 0.8
}
````

Four shard keys:
- `datestamp` -- Not highly random, expect write contention
- `severity_score` -- Not easily divisible
- `_id` -- Queries not targeted at shard
- `severity_score ASC`, `datestamp DEC` -- expect to yeald best results

Typical usage patterns:
- `x` writes a second
- Last 200 logs
- Average `severity_score` by minute in last hour

Dimensions of data:

1. Shard key
2. Number of shards -- nil, 2, 3
3. Manual vs Automated Chunking with existing data

Measurements:

- Average response time?
- CPU %?
- Page Faults ?
- mongostat? (insert, query, update, delete, etc) -> Capacity Planning



