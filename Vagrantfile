VAGRANTFILE_API_VERSION = "2"

Vagrant.require_version ">= 1.6.5"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "geerlingguy/ubuntu1404"
  config.vm.box_check_update = true

  config.vm.network :private_network, ip: "10.10.10.5"

  config.ssh.forward_agent = true

  config.vm.provider "virtualbox" do |vm|
    vm.memory = 2048
    vm.cpus = 2
  end

  config.vm.provider "vmware_fusion" do |vm|
    vm.memory = 2048
    vm.cpus = 2
  end

  config.vm.provision "shell", path: "vagrant.provision.sh", privileged: false
end