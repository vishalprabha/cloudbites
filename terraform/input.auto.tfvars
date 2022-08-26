apps = {
  cloudbites-server = {
    size = 30
  },
  observability-server = {
    size = 10,
  }
  load-balancer-server = {
    size = 10,
    tags = ["http-server", "https-server"]
  }
}