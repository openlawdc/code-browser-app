A quick proof-of-concept code browser for the DC Code.

This is a much simpler and less feature-rich system that more developed
stuff like [The State Decoded](http://www.statedecoded.com/), but ideally
is either a proof-of-concept of a fully static approach or at least a useful
tool for proofing [our parser](https://github.com/openlawdc/dc-decoded).

This site takes a [static approach](http://macwright.org/2013/01/08/thinking-static.html)
to the task. There's no server, but there's a multitude of files. The
initial target for deployment is [Amazon S3](http://aws.amazon.com/s3/). The
site is deployed with [s3cmd](http://s3tools.org/) and takes about 16,000
`PUT` requests to go live.

CloudFront dist: http://d1eu6ip9xyd6yj.cloudfront.net/
