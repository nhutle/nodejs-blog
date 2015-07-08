# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # All Vagrant configuration is done here. The most common configuration
  # options are documented and commented below. For a complete reference,
  # please see the online documentation at vagrantup.com.

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = "nodejs-practice-box"

  # The url from where the 'config.vm.box' box will be fetched if it
  # doesn't already exist on the user's system.
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network :private_network, ip: "192.168.33.10"
  config.vm.network :forwarded_port, guest: 3000, host: 3000
  config.vm.network :forwarded_port, guest: 27017, host: 27017
  config.vm.network :forwarded_port, guest: 9778, host: 9778
  config.vm.network :forwarded_port, guest: 9000, host: 9000
  config.vm.network :forwarded_port, guest: 35729, host: 35729
  config.vm.network :forwarded_port, guest: 8080, host: 8080
  # config.vm.network :forwarded_port, guest: 9778, host: 9778

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network :public_network

  # If true, then any SSH connections made will enable agent forwarding.
  # Default value: false
  # config.ssh.forward_agent = true

  # config.vbguest.auto_update = false
  # config.vbguest.no_remote = true

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"
  config.vm.synced_folder(".", "/practices",
                          :owner => "vagrant",
                          :group => "vagrant",
                          :mount_options => ['dmode=777','fmode=777'])

  config.vm.provider :virtualbox do |vb|
    vb.name = "nodejsPractice"
    vb.customize ["modifyvm", :id, "--memory", "1024"]
  end

  config.vm.provision :shell, path: "provision.sh", :privileged => false

end
