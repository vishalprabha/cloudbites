terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
    }
  }
}

provider "google" {
  #credentials = file("credentials.json")

  project = "cloudbites-344423"
  region  = "us-central1"
  zone    = "us-central1-c"
}


resource "google_compute_instance" "default" {

  for_each = var.apps
  name         = each.key
  machine_type = "e2-medium"
  zone         = "us-central1-a"

  tags = lookup(each.value, "tags","") != "" ? each.value["tags"] : []

  boot_disk {
    initialize_params {
      image = "https://www.googleapis.com/compute/v1/projects/ubuntu-os-cloud/global/images/ubuntu-2004-focal-v20220419"
      size  = each.value["size"]
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }

  metadata = {
    foo = "bar"
  }
}

locals {
  instance_ips = { for key, value in google_compute_instance.default: key=>value.network_interface.0.network_ip }
}
resource "local_file" "myfile" {
  content = yamlencode(local.instance_ips)
  filename = "apps_ip.json"
}

#data "google_compute_image" "custom" {
#  name = "cloudbites-linux-server"
#  project = "cloudbites-344423"
#}
#resource "google_compute_instance" "from_custom_image" {
#
#  name         = "custom-image-vm"
#  machine_type = "e2-medium"
#  zone         = "us-central1-a"
#
#  tags = ["http-server", "https-server"]
#
#  boot_disk {
#    initialize_params {
#      image = data.google_compute_image.custom.self_link
#      size  = 30
#    }
#  }
#
#  network_interface {
#    network = "default"
#    access_config {}
#  }
#
#  metadata = {
#    foo = "bar"
#  }
#}
